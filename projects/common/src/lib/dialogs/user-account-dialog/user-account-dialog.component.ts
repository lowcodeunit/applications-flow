import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { EaCService } from '../../services/eac.service';
import { ProjectService } from '../../services/project.service';
import {
    ApplicationsFlowState,
    LicenseAndBillingResponse,
} from '../../state/applications-flow.state';

@Component({
    selector: 'lcu-user-account-dialog',
    templateUrl: './user-account-dialog.component.html',
    styleUrls: ['./user-account-dialog.component.scss'],
})
export class UserAccountDialogComponent implements OnInit, OnDestroy {
    /**
     * Optional feedback given by user
     */
    public CancellationFeedback: string;

    /**
     * The Billing cycle for the lcu
     */
    public BillingCycle: string;

    /**
     * The Users Billing State
     */
    // public BillingState: UserBillingState;

    /**
     * The Expiration date of the free trial for the given user
     */
    public ExpirationDate: Date;

    /**
     * The Users State
     */
    // public UserState: UserManagementState;

    /**
     * The users username from the state
     */
    public Username: string;

    /**
     * The IDE state
     */
    // public IdeState: IdeManagementState;

    /**
     * Determines which state the modal is in user account info or cancellation
     */
    public IsUserAccount: boolean;

    /**
     * Determines if the user is on the main user account slide or the managing subscription slide
     */
    public ManagingSubscription: boolean;

    /**
     * The next billing date converted to string
     */
    public NextBillingDate: Date;

    /**
     * Determines which text to show on the cansellation modal when user is confirming
     */
    public IsInitialReason: boolean;

    /**
     * The users Package
     */
    public Package: string;

    /**
     * Reasons for leaving the platform to be displayed when user cancels
     */
    // public Reasons: Array<string> = Constants.REASONS_FOR_LEAVING;

    /**
     * Selected reason for leaving
     */
    public ReasonForLeaving: string;

    /**
     * Date the user has been rgistered since
     */
    public RegisteredSince: Date;

    public UserInfo: LicenseAndBillingResponse;

    public State: ApplicationsFlowState;

    public StateSub: Subscription;

    public UserPlan: string;

    /**
     * The interval of the plan ie annual or Monthly
     */
    public PlanInterval: string;

    constructor(
        protected dialogRef: MatDialogRef<UserAccountDialogComponent>,
        protected eacSvc: EaCService,
        @Inject(MAT_DIALOG_DATA) public data: ApplicationsFlowState,
        protected projectSvc: ProjectService
    ) {
        this.ManagingSubscription = false;
        this.IsUserAccount = true;
        this.IsInitialReason = true;
        // console.log('DATA: ', this.data);
        this.userStateChanged();
    }

    public ngOnInit(): void {
        this.StateSub = this.eacSvc.State.subscribe(
            (state: ApplicationsFlowState) => {
                this.State = state;

                this.UserInfo = this.State?.UserLicenseInfo;

                this.UserPlan = this.UserInfo?.Plan?.Name
                    ? this.UserInfo?.Plan?.Name
                    : 'Fathym - Starter';

                this.PlanInterval = this.UserInfo?.Price?.Interval;
            }
        );
    }

    public ngOnDestroy(): void {
        this.StateSub.unsubscribe();
    }

    // public ChangeEmail() {
    //     console.log('change email clicked');
    // }

    public ChangePassword() {
        // console.log('change password clicked');
        window.location.href = '/.auth/B2C_1_PASSWORD_RESET';
    }

    /**
     * Logs out the user
     */
    public Logout() {
        window.location.href = '/.oauth/logout';
    }

    /**
     * Toggles ManagingSubscription to true
     *
     * (May build out further functionality later)
     */
    public ManageSubscription() {
        this.ManagingSubscription = true;
    }
    /**
     * Toggles ManagingSubscription to false in order to exit the editing state
     */
    // public GoBack() {
    //     this.ManagingSubscription = false;
    // }

    public GoBackToUserAccount() {
        // console.log("User Given Feedback", this.CancellationFeedback);
        // if(this.CancellationFeedback){
        //   this.usersStateCtx.SendReasonFeedback(this.CancellationFeedback);
        // }
        this.IsUserAccount = true;
        this.dialogRef.updatePosition({ right: '0px', top: '64px' });
        this.dialogRef.updateSize('260');
    }
    /**
     * Leads to subscription cancellation modal
     */
    public DisplayCancelSubscription() {
        // console.log("display cancel Subscription selected");
        // center the dialog on the screen
        this.dialogRef.updatePosition({});
        //width x height
        this.dialogRef.updateSize('300px', '500px');

        this.IsUserAccount = false;
    }
    /**
     * Cancels the subscription and toggles IsInitialReason to false to go to next screen
     */
    public CancelSubscription() {
        this.IsInitialReason = false;
        // this.usersStateCtx.CancelSubscription(this.ReasonForLeaving);
    }

    /**
     * Sends user to area where they can upgade their plan
     */
    public ChangePlan() {
        console.log('Upgarde selected');
        window.location.href = '/dashboard/billing/upgrade';
    }

    /**
     * Checks to see if the user has selected a reason why
     * they are canceling to enable the confirmation button
     */
    // public CheckIfReasonGiven() {
    //     if (this.ReasonForLeaving && this.ReasonForLeaving.length > 0) {
    //         return false;
    //     } else {
    //         return true;
    //     }
    // }

    /**
     * Closes the dialog while also checking to see if the user supplied any additional feedback
     */
    public Close() {
        // if(this.CancellationFeedback){
        //   this.usersStateCtx.SendReasonFeedback(this.CancellationFeedback);
        // }
        this.dialogRef.close();
    }

    // protected ideStateChanged(){
    //   if(this.IdeState.Username){
    //     this.Username = this.IdeState.Username;
    //   }
    // }
    /**
     * Assigns the info that is displayed in the user account
     */
    protected userStateChanged() {
        if (this.State?.UserLicenseInfo) {
        }
        // if(this.UserState.SubscriptionDetails){
        //   this.NextBillingDate = new Date(this.UserState.SubscriptionDetails.BillingPeriodEnd);
        //   this.RegisteredSince = new Date(this.UserState.SubscriptionDetails.SubscriptionCreated);
        // }
        // if(this.UserState.UserLicenses){
        //   this.UserState.UserLicenses.forEach(lic => {
        //     if(lic.LicenseType =  "lcu"){
        //       this.BillingCycle = lic.Interval +"ly";
        //       this.ExpirationDate = new Date(lic.ExpirationDate);
        //       // this.Username = lic.Username;
        //       this.Package = lic.Name;
        //     }
        //   })
        // }
    }
}
