import { NgModule } from '@angular/core';
import { ROUTES, RouterModule } from '@angular/router';
import { NbAuthModule } from '@nebular/auth';
import {
	NbAccordionModule,
	NbAlertModule,
	NbButtonModule,
	NbCardModule,
	NbCheckboxModule,
	NbDialogModule,
	NbFormFieldModule,
	NbIconModule,
	NbInputModule,
	NbLayoutModule,
	NbListModule,
	NbSelectModule,
	NbSpinnerModule,
	NbTooltipModule
} from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { ElectronService, InviteService, PageRouteService, RoleService } from '@gauzy/ui-core/core';
import { ThemeModule, ThemeSelectorModule } from '@gauzy/ui-core/theme';
import { NgxFaqModule, PasswordFormFieldModule, SharedModule } from '@gauzy/ui-core/shared';
import { createRoutes } from './auth.routes';
import { WorkspaceSelectionComponent } from './components/workspace-selection/workspace-selection.component';
import { SocialLinksComponent } from './components/social-links/social-links.component';
import { NgxLoginWorkspaceComponent } from './components/login-workspace/login-workspace.component';
import { NgxLoginMagicComponent } from './components/login-magic/login-magic.component';
import { NgxMagicSignInWorkspaceComponent } from './components/magic-login-workspace/magic-login-workspace.component';
import { NgxResetPasswordComponent } from './components/reset-password/reset-password.component';
import { NgxRegisterComponent } from './components/register/register.component';
import { NgxAuthComponent } from './components/auth/auth.component';
import { NgxRegisterSideSingleFeatureComponent } from './components/register/register-side-features/register-side-single-feature/register-side-single-feature.component';
import { NgxRegisterSideFeaturesComponent } from './components/register/register-side-features/register-side-features.component';
import { NgxForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { NgxWhatsNewComponent } from './components/whats-new/whats-new.component';
import { NgxLoginComponent } from './components/login/login.component';
import { ConfirmEmailComponent } from './components/confirm-email/confirm-email.component';
import { AcceptInviteComponent } from './components/accept-invite/accept-invite.component';
import { AcceptInviteFormComponent } from './components/accept-invite/accept-invite-form/accept-invite-form.component';
import { AcceptClientInviteComponent } from './components/accept-client-invite/accept-client-invite.component';
import { AcceptClientInviteFormComponent } from './components/accept-client-invite/accept-client-invite-form/accept-client-invite-form.component';
import { EstimateEmailComponent } from './components/estimate-email/estimate-email.component';

// Nebular Modules
const NB_MODULES = [
	NbAccordionModule,
	NbAlertModule,
	NbAuthModule,
	NbButtonModule,
	NbCardModule,
	NbCheckboxModule,
	NbDialogModule.forChild(),
	NbFormFieldModule,
	NbIconModule,
	NbInputModule,
	NbLayoutModule,
	NbListModule,
	NbSelectModule,
	NbSpinnerModule,
	NbTooltipModule
];

// Components
const COMPONENTS = [
	AcceptClientInviteComponent,
	AcceptClientInviteFormComponent,
	AcceptInviteComponent,
	AcceptInviteFormComponent,
	ConfirmEmailComponent,
	EstimateEmailComponent,
	NgxAuthComponent,
	NgxForgotPasswordComponent,
	NgxLoginComponent,
	NgxLoginMagicComponent,
	NgxLoginWorkspaceComponent,
	NgxMagicSignInWorkspaceComponent,
	NgxRegisterComponent,
	NgxRegisterSideFeaturesComponent,
	NgxRegisterSideSingleFeatureComponent,
	NgxResetPasswordComponent,
	NgxWhatsNewComponent,
	SocialLinksComponent,
	WorkspaceSelectionComponent
];

const THIRD_PARTY_MODULES = [TranslateModule.forChild()];

@NgModule({
	imports: [
		RouterModule.forChild([]),
		...NB_MODULES,
		...THIRD_PARTY_MODULES,
		ThemeSelectorModule,
		NgxFaqModule,
		ThemeModule,
		SharedModule,
		PasswordFormFieldModule
	],
	declarations: [...COMPONENTS],
	providers: [
		ElectronService,
		{
			provide: ROUTES,
			useFactory: (pageRouteService: PageRouteService) => createRoutes(pageRouteService),
			deps: [PageRouteService],
			multi: true
		},
		InviteService,
		RoleService
	]
})
export class NgxAuthModule {}
