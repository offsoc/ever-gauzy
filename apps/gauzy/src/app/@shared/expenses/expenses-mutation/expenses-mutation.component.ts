import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import {
	FormBuilder,
	Validators,
	FormGroup,
	AbstractControl
} from '@angular/forms';
import { ExpenseViewModel } from '../../../pages/expenses/expenses.component';
import {
	CurrenciesEnum,
	OrganizationSelectInput,
	TaxTypesEnum,
	ExpenseTypesEnum,
	IOrganizationVendor,
	Tag,
	OrganizationContact,
	OrganizationProjects,
	ExpenseStatusesEnum
} from '@gauzy/models';
import { OrganizationsService } from '../../../@core/services/organizations.service';
import { Store } from '../../../@core/services/store.service';
import { first, takeUntil } from 'rxjs/operators';
import {
	EmployeeSelectorComponent,
	ALL_EMPLOYEES_SELECTED,
	SelectedEmployee
} from '../../../@theme/components/header/selectors/employee/employee.component';
import { OrganizationVendorsService } from '../../../@core/services/organization-vendors.service';
import { OrganizationContactService } from '../../../@core/services/organization-contact.service';
import { OrganizationProjectsService } from '../../../@core/services/organization-projects.service';
import { AttachReceiptComponent } from './attach-receipt/attach-receipt.component';
import { Subject } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';
import { TranslationBaseComponent } from '../../language-base/translation-base.component';
import { ErrorHandlingService } from '../../../@core/services/error-handling.service';
import { IOrganizationExpenseCategory } from '../../../../../../../libs/models/src/lib/organization-expense-category.model';
import { OrganizationExpenseCategoriesService } from '../../../@core/services/organization-expense-categories.service';
import { EmployeesService } from '../../../@core/services';
import { EmployeeStatisticsService } from '../../../@core/services/employee-statistics.service';

@Component({
	selector: 'ga-expenses-mutation',
	templateUrl: './expenses-mutation.component.html',
	styleUrls: ['./expenses-mutation.component.scss']
})
export class ExpensesMutationComponent extends TranslationBaseComponent
	implements OnInit, OnDestroy {
	private _ngDestroy$ = new Subject<void>();

	@ViewChild('employeeSelector')
	employeeSelector: EmployeeSelectorComponent;
	form: FormGroup;
	expense: ExpenseViewModel;
	organizationId: string;
	typeOfExpense: string;
	expenseTypes = Object.values(ExpenseTypesEnum);
	currencies = Object.values(CurrenciesEnum);
	taxTypes = Object.values(TaxTypesEnum);
	expenseStatuses = Object.values(ExpenseStatusesEnum);
	expenseCategories: IOrganizationExpenseCategory[];
	vendors: IOrganizationVendor[];
	organizationContacts: {
		organizationContactName: string;
		organizationContactId: string;
	}[] = [];
	projects: { projectName: string; projectId: string }[] = [];
	defaultImage = './assets/images/others/invoice-template.png';
	calculatedValue = '0';
	duplicate: boolean;
	showNotes = false;
	showTaxesInput = false;
	showWarning = false;
	disable = true;
	loading = false;
	tags: Tag[] = [];
	selectedTags: any;
	valueDate: AbstractControl;
	amount: AbstractControl;
	notes: AbstractControl;
	showTooltip = false;
	disableStatuses = false;
	averageExpense = 0;

	constructor(
		public dialogRef: NbDialogRef<ExpensesMutationComponent>,
		private dialogService: NbDialogService,
		private fb: FormBuilder,
		private organizationsService: OrganizationsService,
		private organizationVendorsService: OrganizationVendorsService,
		private store: Store,
		private readonly organizationContactService: OrganizationContactService,
		private employeesService: EmployeesService,
		private readonly organizationProjectsService: OrganizationProjectsService,
		private readonly expenseCategoriesStore: OrganizationExpenseCategoriesService,
		private readonly toastrService: NbToastrService,
		readonly translateService: TranslateService,
		private errorHandler: ErrorHandlingService,
		private employeeStatisticsService: EmployeeStatisticsService
	) {
		super(translateService);
	}

	ngOnInit() {
		this.getDefaultData();
		this.loadOrganizationContacts();
		this.loadProjects();
		this._initializeForm();
		this.form.get('currency');
		this.changeExpenseType(this.form.value.typeOfExpense);
	}

	get currency() {
		return this.form.get('currency');
	}

	private async getDefaultData() {
		this.organizationId = this.store.selectedOrganization.id;
		const { items: category } = await this.expenseCategoriesStore.getAll({
			organizationId: this.organizationId
		});
		this.expenseCategories = category;
		this.organizationId = this.store.selectedOrganization.id;
		const { items: vendors } = await this.organizationVendorsService.getAll(
			{
				organizationId: this.organizationId
			}
		);
		this.vendors = vendors;
	}

	async addOrEditExpense() {
		if (
			this.form.value.typeOfExpense === 'Billable to Contact' &&
			!this.form.value.organizationContact
		) {
			this.showWarning = true;
			setTimeout(() => {
				this.closeWarning();
			}, 3000);
			return;
		} else {
			this.closeWarning();
		}

		if (this.form.value.organizationContact === null) {
			this.form.value.organizationContact = {
				organizationContactName: null,
				organizationContactId: null
			};
		}

		if (this.form.value.project === null) {
			this.form.value.project = {
				projectName: null,
				projectId: null
			};
		}

		if (this.employeeSelector.selectedEmployee === ALL_EMPLOYEES_SELECTED)
			this.form.value.splitExpense = true;

		if (this.form.value.typeOfExpense !== 'Billable to Contact') {
			this.form.value.status = 'Not Billable';
		}

		this.dialogRef.close(
			Object.assign(
				{ employee: this.employeeSelector.selectedEmployee },
				this.form.value
			)
		);
		await this.getEmployeeStatistics(
			this.employeeSelector.selectedEmployee.id
		);
		this.employeesService.update(
			this.employeeSelector.selectedEmployee.id,
			{
				averageExpenses: this.averageExpense
			}
		);
	}

	async getEmployeeStatistics(id) {
		const statistics = await this.employeeStatisticsService.getStatisticsByEmployeeId(
			id
		);
		this.averageExpense = this.countStatistic(statistics.expenseStatistics);
	}

	countStatistic(data: number[]) {
		return data.filter(Number).reduce((a, b) => a + b, 0) !== 0
			? data.filter(Number).reduce((a, b) => a + b, 0) /
					data.filter(Number).length
			: 0;
	}

	addNewCategory = async (
		name: string
	): Promise<IOrganizationExpenseCategory> => {
		try {
			this.toastrService.primary(
				this.getTranslation('EXPENSES_PAGE.ADD_EXPENSE_CATEGORY'),
				this.getTranslation('TOASTR.TITLE.SUCCESS')
			);
			return await this.expenseCategoriesStore.create({
				name,
				organizationId: this.organizationId
			});
		} catch (error) {
			this.errorHandler.handleError(error);
		}
	};

	addNewVendor = (name: string): Promise<IOrganizationVendor> => {
		try {
			this.toastrService.primary(
				this.getTranslation(
					'NOTES.ORGANIZATIONS.EDIT_ORGANIZATIONS_VENDOR.ADD_VENDOR',
					{
						name: name
					}
				),
				this.getTranslation('TOASTR.TITLE.SUCCESS')
			);
			return this.organizationVendorsService.create({
				name,
				organizationId: this.organizationId
			});
		} catch (error) {
			this.errorHandler.handleError(error);
		}
	};

	addNewOrganizationContact = (
		name: string
	): Promise<OrganizationContact> => {
		try {
			this.toastrService.primary(
				this.getTranslation(
					'NOTES.ORGANIZATIONS.EDIT_ORGANIZATIONS_CONTACTS.ADD_CONTACT',
					{
						name: name
					}
				),
				this.getTranslation('TOASTR.TITLE.SUCCESS')
			);
			return this.organizationContactService.create({
				name,
				organizationId: this.organizationId
			});
		} catch (error) {
			this.errorHandler.handleError(error);
		}
	};

	addNewProject = (name: string): Promise<OrganizationProjects> => {
		this.organizationId = this.store.selectedOrganization.id;
		try {
			this.toastrService.primary(
				this.getTranslation(
					'NOTES.ORGANIZATIONS.EDIT_ORGANIZATIONS_PROJECTS.ADD_PROJECT',
					{
						name: name
					}
				),
				this.getTranslation('TOASTR.TITLE.SUCCESS')
			);
			return this.organizationProjectsService.create({
				name,
				organizationId: this.organizationId
			});
		} catch (error) {
			this.errorHandler.handleError(error);
		}
	};

	showNotesInput() {
		return (this.showNotes = !this.showNotes);
	}

	includeTaxes() {
		if (this.form.value.taxType) {
			this.disable = false;
		}
		this.calculateTaxes();
		return (this.showTaxesInput = !this.showTaxesInput);
	}

	private _initializeForm() {
		if (this.expense) {
			this.form = this.fb.group({
				id: [this.expense.id],
				amount: [this.expense.amount, Validators.required],
				vendor: [this.expense.vendor, Validators.required],
				typeOfExpense: this.expense.typeOfExpense,
				category: [this.expense.category, Validators.required],
				notes: [this.expense.notes],
				currency: [this.expense.currency],
				valueDate: [
					new Date(this.expense.valueDate),
					Validators.required
				],
				purpose: [this.expense.purpose],
				organizationContact: [this.expense.organizationContactName],
				project: [this.expense.projectName],
				taxType: [this.expense.taxType],
				taxLabel: [this.expense.taxLabel],
				rateValue: [this.expense.rateValue],
				receipt: [this.expense.receipt],
				splitExpense: [this.expense.splitExpense],
				tags: [this.expense.tags],
				status: [this.expense.status]
			});
		} else {
			this.form = this.fb.group({
				amount: ['', Validators.required],
				vendor: [null, Validators.required],
				typeOfExpense: [this.expenseTypes[0]],
				category: [null, Validators.required],
				notes: [''],
				currency: [''],
				valueDate: [
					this.store.getDateFromOrganizationSettings(),
					Validators.required
				],
				purpose: [''],
				organizationContact: [null],
				project: [null],
				taxType: [TaxTypesEnum.PERCENTAGE],
				taxLabel: [''],
				rateValue: [0],
				receipt: [this.defaultImage],
				splitExpense: [false],
				tags: [],
				status: []
			});

			this._loadDefaultCurrency();
		}
		this.valueDate = this.form.get('valueDate');
		this.amount = this.form.get('amount');
		this.notes = this.form.get('notes');
		this.tags = this.form.get('tags').value || [];
	}

	private calculateTaxes() {
		this.form.valueChanges
			.pipe(takeUntil(this._ngDestroy$))
			.subscribe((val) => {
				const amount = val.amount;
				const rate = val.rateValue;
				const oldNotes = val.notes;

				if (val.taxType === 'Percentage') {
					const result = (amount / (rate + 100)) * 100 * (rate / 100);

					this.calculatedValue =
						'Tax Amount: ' + result.toFixed(2) + ' ' + val.currency;
				} else {
					const result = (rate / (amount - rate)) * 100;
					this.calculatedValue =
						'Tax Rate: ' + result.toFixed(2) + ' %';
				}

				if (rate !== 0) {
					val.notes = this.calculatedValue + '. ' + oldNotes;
				}
			});
	}

	private async loadOrganizationContacts() {
		const res = await this.organizationContactService.getAll(['projects'], {
			organizationId: this.organizationId
		});

		if (res) {
			res.items.forEach((organizationContact) => {
				this.organizationContacts.push({
					organizationContactName: organizationContact.name,
					organizationContactId: organizationContact.id
				});
			});
		}
	}

	private async loadProjects() {
		const res = await this.organizationProjectsService.getAll(
			['organizationContact'],
			{
				organizationId: this.organizationId
			}
		);

		if (res) {
			res.items.forEach((project) => {
				this.projects.push({
					projectName: project.name,
					projectId: project.id
				});
			});
		}
	}

	private async _loadDefaultCurrency() {
		const orgData = await this.organizationsService
			.getById(this.store.selectedOrganization.id, [
				OrganizationSelectInput.currency
			])
			.pipe(first())
			.toPromise();

		if (orgData && this.currency && !this.currency.value) {
			this.currency.setValue(orgData.currency);
		}
	}

	closeWarning() {
		this.showWarning = !this.showWarning;
	}

	attachReceipt() {
		this.dialogService
			.open(AttachReceiptComponent, {
				context: {
					currentReceipt: this.form.value.receipt
				}
			})
			.onClose.pipe(takeUntil(this._ngDestroy$))
			.subscribe((newReceipt) => {
				this.form.value.receipt = newReceipt;
			});
	}

	selectedTagsHandler(currentSelection: Tag) {
		this.form.get('tags').setValue(currentSelection);
	}

	onEmployeeChange(selectedEmployee: SelectedEmployee) {
		this.showTooltip = selectedEmployee === ALL_EMPLOYEES_SELECTED;
	}

	changeExpenseType($event) {
		if ($event !== 'Billable to Contact') {
			this.disableStatuses = true;
		} else {
			this.disableStatuses = false;
		}
	}

	ngOnDestroy() {
		this._ngDestroy$.next();
		this._ngDestroy$.complete();
		clearTimeout();
	}
}
