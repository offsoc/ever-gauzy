import {
	IBasePerTenantAndOrganizationEntityModel,
	IBaseRelationsEntityModel,
} from './base-entity.model';
import {
	IOrganizationContact,
	OrganizationContactBudgetTypeEnum,
} from './organization-contact.model';
import {
	IOrganizationProject,
	IRelationalOrganizationProject,
	OrganizationProjectBudgetTypeEnum,
} from './organization-projects.model';
import {
	IEmployee,
	IEmployeeFindInput,
	IRelationalEmployee,
} from './employee.model';
import { ITask } from './task.model';
import { ITag } from './tag.model';
import { IPaginationInput } from './core.model';
import { ReportGroupByFilter } from './report.model';
import { IUser } from './user.model';
import { IRelationalOrganizationTeam } from './organization-team.model';
import { IScreenshot } from './screenshot.model';

export interface ITimesheet extends IBasePerTenantAndOrganizationEntityModel {
	employee: IEmployee;
	employeeId?: IEmployee['id'];
	approvedBy?: IUser;
	approvedById?: IUser['id'];
	timeLogs?: ITimeLog[];
	duration?: number;
	keyboard?: number;
	mouse?: number;
	overall?: number;
	startedAt?: Date;
	stoppedAt?: Date;
	approvedAt?: Date;
	submittedAt?: Date;
	lockedAt?: Date;
	editedAt?: Date;
	isBilled?: boolean;
	status: string;
	isEdited?: boolean;
}

export interface ITimesheetCreateInput extends IBasePerTenantAndOrganizationEntityModel {
	employeeId: string;
	approvedById?: string;
	duration: number;
	keyboard: number;
	mouse: number;
	overall?: number;
	startedAt: Date;
	stoppedAt?: Date;
	approvedAt?: Date;
	submittedAt?: Date;
	lockedAt?: Date;
	isBilled?: boolean;
	status?: string;
}

export interface ITimeSheetFindInput extends IBasePerTenantAndOrganizationEntityModel {
	employeeId: string;
	approvedById?: string;
	employee: IEmployeeFindInput;
	isBilled?: boolean;
	status?: string;
	startedAt: Date;
	stoppedAt?: Date;
	approvedAt?: Date;
	submittedAt?: Date;
}

export enum TimesheetStatus {
	DRAFT = 'DRAFT',
	PENDING = 'PENDING',
	IN_REVIEW = 'IN REVIEW',
	DENIED = 'DENIED',
	APPROVED = 'APPROVED',
}

export interface IUpdateTimesheetStatusInput
	extends IBasePerTenantAndOrganizationEntityModel {
	ids: string | string[];
	status?: TimesheetStatus;
}

export interface ISubmitTimesheetInput
	extends IBasePerTenantAndOrganizationEntityModel {
	ids: string | string[];
	status: 'submit' | 'unsubmit';
}

export interface IGetTimesheetInput
	extends IBasePerTenantAndOrganizationEntityModel,
	IBaseRelationsEntityModel {
	startDate?: Date | string;
	endDate?: Date | string;
	projectIds?: string[];
	clientId?: string[];
	employeeIds?: string[];
}

export interface IDateRange {
	start: Date;
	end: Date;
}
export interface ITimeLog extends IBasePerTenantAndOrganizationEntityModel, IRelationalOrganizationProject, IRelationalOrganizationTeam {
	employee: IEmployee;
	employeeId: IEmployee['id'];
	timesheet?: ITimesheet;
	timesheetId?: ITimesheet['id'];
	task?: ITask;
	taskId?: ITask['id'];
	timeSlots?: ITimeSlot[];
	project?: IOrganizationProject;
	projectId?: IOrganizationProject['id'];
	organizationContact?: IOrganizationContact;
	organizationContactId?: IOrganizationContact['id'];
	source?: TimeLogSourceEnum;
	startedAt?: Date;
	stoppedAt?: Date;
	/** Edited At* */
	editedAt?: Date;
	logType: TimeLogType;
	description?: string;
	reason?: string;
	duration: number;
	isBillable: boolean;
	tags?: string[];
	isRunning?: boolean;
	isEdited?: boolean;
}

export interface ITimeLogCreateInput
	extends IBasePerTenantAndOrganizationEntityModel {
	employeeId: string;
	timesheetId?: string;
	taskId?: string;
	projectId: string;
	startedAt?: Date;
	stoppedAt?: Date;
	logType: TimeLogType;
	description?: string;
	duration: number;
	isBillable?: boolean;
	isBilled?: boolean;
}

export interface ITimeSlotCreateInput
	extends IBasePerTenantAndOrganizationEntityModel {
	employeeId: string;
	duration: number;
	keyboard: number;
	mouse: number;
	overall: number;
	startedAt: Date;
	time_slot: Date;
}

export enum TimeLogType {
	TRACKED = 'TRACKED',
	MANUAL = 'MANUAL',
	IDLE = 'IDLE',
	RESUMED = 'RESUMED',
}

export enum ManualTimeLogAction {
	ADDED = 'ADDED',
	EDITED = 'EDITED',
}

export enum TimeLogSourceEnum {
	MOBILE = 'MOBILE',
	WEB_TIMER = 'BROWSER',
	DESKTOP = 'DESKTOP',
	BROWSER_EXTENSION = 'BROWSER_EXTENSION',
	HUBSTAFF = 'HUBSTAFF',
	UPWORK = 'UPWORK',
	TEAMS = 'TEAMS',
}

export interface ITimeLogFilters
	extends IBasePerTenantAndOrganizationEntityModel {
	date?: Date | string;
	startDate?: Date | string;
	endDate?: Date | string;
	isCustomDate?: boolean;
	projectIds?: string[];
	teamIds?: string[];
	employeeIds?: string[];
	logType?: TimeLogType[];
	source?: TimeLogSourceEnum[];
	activityLevel?: {
		start: number;
		end: number;
	};
	taskIds?: string[];
	defaultRange?: boolean;
	unitOfTime?: any;
}

export interface ITimeLogTodayFilters
	extends IBasePerTenantAndOrganizationEntityModel {
	todayStart?: Date | string;
	todayEnd?: Date | string;
}

export interface ITimeSlot extends IBasePerTenantAndOrganizationEntityModel {
	[x: string]: any;
	employeeId: string;
	employee?: IEmployee;
	activities?: IActivity[];
	screenshots?: IScreenshot[];
	timeLogs?: ITimeLog[];
	timeSlotMinutes?: ITimeSlotMinute[];
	project?: IOrganizationProject;
	projectId?: string;
	duration?: number;
	keyboard?: number;
	mouse?: number;
	overall?: number;
	startedAt: Date;
	stoppedAt?: Date;
	percentage?: number;
	keyboardPercentage?: number;
	mousePercentage?: number;
	tags?: ITag[];
	isAllowDelete?: boolean;
}

export interface ITimeSlotTimeLogs
	extends IBasePerTenantAndOrganizationEntityModel {
	timeLogs: ITimeLog[];
	timeSlots: ITimeSlot[];
	timeLogId: string;
	timeSlotId: string;
}

export interface ITimeSlotMinute
	extends IBasePerTenantAndOrganizationEntityModel {
	timeSlot?: ITimeSlot;
	timeSlotId?: string;
	keyboard?: number;
	mouse?: number;
	datetime?: Date;
}

export interface IActivity extends IBasePerTenantAndOrganizationEntityModel {
	title: string;
	description?: string;
	employee?: IEmployee;
	employeeId?: string;
	timeSlot?: ITimeSlot;
	timeSlotId?: string;
	project?: IOrganizationProject;
	projectId?: string;
	task?: ITask;
	taskId?: string;
	metaData?: string | IURLMetaData;
	date: string;
	time: string;
	duration?: number;
	type?: string;
	source?: string;
	id?: string;
	activityTimestamp?: string;
	recordedAt?: Date;
}

export interface IDailyActivity {
	[x: string]: any;
	sessions?: number;
	duration?: number;
	employeeId?: string;
	date?: string;
	title?: string;
	description?: string;
	durationPercentage?: number;
	childItems?: IDailyActivity[];
}

export interface ICreateActivityInput
	extends IBasePerTenantAndOrganizationEntityModel {
	employeeId?: string;
	projectId?: string;
	duration?: number;
	keyboard?: number;
	mouse?: number;
	overall?: number;
	startedAt?: Date;
	stoppedAt?: Date;
	timeSlotId?: string;
	type: string;
	title: string;
	data?: string;
}

export enum ActivityType {
	URL = 'URL',
	APP = 'APP',
}

export interface IURLMetaData {
	title?: string;
	description?: string;
	image?: string;
	[x: string]: any;
}



export interface ITimerStatusInput extends ITimeLogTodayFilters, IBaseRelationsEntityModel, IRelationalEmployee, IRelationalOrganizationTeam {
	source?: TimeLogSourceEnum;
	employeeIds?: string[];
}

export interface ITimerStatus {
	duration?: number;
	running?: boolean;
	lastLog?: ITimeLog;
	lastWorkedTask?: ITask;
	timerStatus?: 'running' | 'pause' | 'idle';
}
export interface TimerState {
	showTimerWindow: boolean;
	duration: number;
	currentSessionDuration: number;
	running: boolean;
	position: ITimerPosition;
	timerConfig: ITimerToggleInput;
}

export interface ITimerPosition {
	x: number;
	y: number;
}

export interface ITimerToggleInput
	extends IBasePerTenantAndOrganizationEntityModel,
	Pick<IRelationalOrganizationTeam, 'organizationTeamId'> {
	projectId?: string;
	taskId?: string;
	organizationContactId?: string;
	description?: string;
	logType?: TimeLogType;
	source?: TimeLogSourceEnum;
	tags?: string[];
	isBillable?: boolean;
	manualTimeSlot?: boolean;
	version?: string;
	startedAt?: Date;
	stoppedAt?: Date;
}

export interface IManualTimeInput extends IBasePerTenantAndOrganizationEntityModel {
	id?: string;
	employeeId?: string;
	projectId?: string;
	taskId?: string;
	organizationContactId?: string;
	logType?: TimeLogType;
	description?: string;
	reason?: string;
	startedAt?: Date;
	stoppedAt?: Date;
	editedAt?: Date;
	tags?: string[];
	isBillable?: boolean;
}

export interface IGetTimeLogInput extends ITimeLogFilters, IBaseRelationsEntityModel {
	timesheetId?: string;
	timezone?: string;
}

export interface IGetTimeLogReportInput extends IGetTimeLogInput {
	groupBy?: ReportGroupByFilter;
}

export interface IGetTimeLogConflictInput
	extends IBasePerTenantAndOrganizationEntityModel,
	IBaseRelationsEntityModel {
	ignoreId?: string | string[];
	startDate: string | Date;
	endDate: string | Date;
	employeeId: string;
}

export interface IGetTimeSlotInput
	extends ITimeLogFilters,
	IBaseRelationsEntityModel {
	[x: string]: any;
}

export interface IGetActivitiesInput
	extends ITimeLogFilters,
	IPaginationInput,
	IBaseRelationsEntityModel {
	types?: string[];
	titles?: string[];
	groupBy?: string;
}

export interface IBulkActivitiesInput
	extends IBasePerTenantAndOrganizationEntityModel {
	employeeId: string;
	projectId?: string;
	activities: IActivity[];
}

export interface IReportDayGroupByDate {
	date: string;
	logs: {
		project: IOrganizationProject;
		employeeLogs: {
			task: ITask;
			employee: IEmployee;
			sum: number;
			activity: number;
		}[];
	}[];
}

export interface IAmountOwedReport {
	date: string;
	employees: {
		employee: IEmployee;
		duration: number;
		amount: number;
	}[];
}

export interface IReportDayGroupByDate {
	date: string;
	logs: {
		project: IOrganizationProject;
		employeeLogs: {
			task: ITask;
			employee: IEmployee;
			sum: number;
			activity: number;
		}[];
	}[];
}

export interface IReportDayGroupByEmployee {
	employee: IEmployee;
	logs: {
		date: string;
		employeeLogs: {
			sum: number;
			activity: number;
			project: IOrganizationProject;
			task: ITask;
		}[];
	}[];
}

export interface IReportDayGroupByProject {
	project: IOrganizationProject;
	logs: {
		date: string;
		employeeLogs: {
			task: ITask;
			employee: IEmployee;
			sum: number;
			activity: number;
		}[];
	}[];
}

export interface IReportDayGroupByClient {
	client: IOrganizationContact;
	logs: {
		project: IOrganizationProject;
		logs: {
			date: string;
			employeeLogs: {
				task: ITask;
				employee: IEmployee;
				sum: number;
				activity: number;
			}[];
		}[];
	};
}

export type IReportDayData =
	| IReportDayGroupByDate
	| IReportDayGroupByEmployee
	| IReportDayGroupByProject
	| IReportDayGroupByClient;

export interface IGetTimeLimitReportInput
	extends IBasePerTenantAndOrganizationEntityModel,
	IBaseRelationsEntityModel {
	startDate?: string | Date;
	endDate?: string | Date;
	projectIds?: string[];
	employeeIds?: string[];
	duration?: 'day' | 'week' | 'month';
}

export interface ITimeLimitReport {
	date: string;
	employeeLogs: {
		employee: IEmployee;
		duration: number;
		durationPercentage: number;
		limit: number;
	}[];
}

export interface IProjectBudgetLimitReport {
	project?: IOrganizationProject;
	budgetType?: OrganizationProjectBudgetTypeEnum;
	budget?: number;
	spent?: number;
	spentPercentage?: number;
	remainingBudget?: number;
}

export interface IClientBudgetLimitReport {
	organizationContact?: IOrganizationContact;
	budgetType?: OrganizationContactBudgetTypeEnum;
	budget?: number;
	spent?: number;
	spentPercentage?: number;
	remainingBudget?: number;
}

export interface IDeleteTimeSlot
	extends IBasePerTenantAndOrganizationEntityModel {
	ids: string[];
}

export interface IDeleteTimeLog
	extends IBasePerTenantAndOrganizationEntityModel {
	logIds: string[];
	forceDelete: boolean;
}
