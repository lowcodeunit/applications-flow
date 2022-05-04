import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Application } from '@lcu/common';
import { ApplicationsFlowState } from '../../state/applications-flow.state';

@Component({
    selector: 'lcu-user-account-dialog',
    templateUrl: './user-account-dialog.component.html',
    styleUrls: ['./user-account-dialog.component.scss'],
})
export class UserAccountDialogComponent implements OnInit {
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

    public get State(): ApplicationsFlowState {
        return this.data;
    }

    constructor(
        protected dialogRef: MatDialogRef<UserAccountDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ApplicationsFlowState
    ) {
        this.ManagingSubscription = false;
        this.IsUserAccount = true;
        this.IsInitialReason = true;
        console.log('DATA: ', this.data);
        this.userStateChanged();
        // this.LogoutClicked = new EventEmitter<any>();
    }

    public ngOnInit(): void {
        // this.usersStateCtx.Context.subscribe((state: UserManagementState) => {
        //   this.UserState = state;
        //   console.log("Users State: ", this.UserState);
        //   this.userStateChanged();
        // });
        // this.ideStateCtx.Context.subscribe((state: IdeManagementState) => {
        //   this.IdeState = state;
        //   console.log("IDE State: ", this.IdeState);
        //   this.ideStateChanged();
        // });
    }

    /**
     * Logs out the user
     */
    public Logout() {
        window.location.replace('/.oauth/logout');
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
    public GoBack() {
        this.ManagingSubscription = false;
    }

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
     *
     * TODO figure out where to send the user
     */
    public Upgrade() {
        console.log('Upgarde selected');
    }

    /**
     * Checks to see if the user has selected a reason why
     * they are canceling to enable the confirmation button
     */
    public CheckIfReasonGiven() {
        if (this.ReasonForLeaving && this.ReasonForLeaving.length > 0) {
            return false;
        } else {
            return true;
        }
    }

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
