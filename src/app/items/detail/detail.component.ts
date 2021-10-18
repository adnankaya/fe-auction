import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators, NgForm } from '@angular/forms';
import { ItemService } from '../item.service';
import { Bid } from '../models/Bid';
import { Item } from '../models/Item';
import { BidService } from '../bid.service';
import { AuthService } from 'src/app/services/auth.service';
import { AutoBid } from '../models/AutoBid';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  item: Item;
  itemID: number;
  bidFormGroup: FormGroup;
  bidValue: FormControl;
  autoBidFormGroup: FormGroup;
  enableAutobidding: FormControl;
  maxBidValue: number = 100; // TODO: will be used
  minBidValue: number;
  hasError: boolean = false;
  errorMessage: string;
  autoBid: AutoBid;
  autobids: AutoBid[];
  isAutoBidOpen: boolean = false;
  currentUser: User;
  isMaxAmountExceeded: boolean = false;
  maxAmountExceededMessage: string = "Total max amount exceeded the client total fund!";

  constructor(private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private itemService: ItemService,
    private bidService: BidService,
    private authService: AuthService,
  ) {
    const d = this.authService.decodedToken;
    this.currentUser = { id: d.user_id, username: d.username, firstName: d.firstName, lastName: d.lastName, is_superuser: d.is_superuser };

  }

  ngOnInit(): void {
    console.log(this.currentUser);

    this.itemID = +this.route.snapshot.paramMap.get('id');
    this.getItem(this.itemID);
    this.createBidFormGroup();
  }

  getItem(itemID: number): void {
    this.itemService.getItem(itemID).subscribe(
      res => {
        this.item = Object.assign(new Item(), res);
        // console.log('item -> ', this.item);
        this.minBidValue = parseFloat(this.item.max_bid_value ? this.item.max_bid_value : this.item.price) + 1;
        this.bidFormGroup.patchValue({ bidValue: this.minBidValue });
      }, err => { throw err; }
    );
    this.getAutoBid(this.currentUser.id, itemID);
  }
  getAutoBid(user_id: number, itemID: number): void {
    this.bidService.getAutoBid(user_id, itemID).subscribe(
      res => {
        // console.log('autobid -> ', res);
        if (res.length > 0) {
          this.autoBid = res[0];
          this.autoBidFormGroup.patchValue({ enableAutobidding: this.autoBid.is_active });
        }
      },
      error => {
        console.error(error);
      }
    );
  }
  getClientAutoBids(): void {
    this.bidService.getClientAutoBids(this.currentUser.id).subscribe(
      res => {
        this.autobids = res;
        // console.log(this.autobids);

      }, err => {
        console.error(err);
      }
    );
  }
  updateAutoBid(autobid: AutoBid): void {
    this.bidService.updateAutoBid(autobid).subscribe(
      res => {
        // console.log('update autobid -> ', res);

      },
      err => {
        console.error(err);

      }
    );
  }
  submitBid(): void {
    const data: Bid = {
      item: this.item.id,
      value: this.bidValue.value,
      made_by: this.currentUser.id
    }
    this.bidService.postBid(data).subscribe(
      res => {
        if (res) {
          this.getItem(this.item.id);
        }

      }, err => {
        this.hasError = true
        this.errorMessage = err[`error`][0];
      }
    );
  }
  createBidFormGroup(): void {

    this.bidValue = new FormControl({
      value: 0,
      disabled: false
    },
      [Validators.required,
      Validators.max(this.maxBidValue),
      Validators.min(this.minBidValue),
      Validators.maxLength(12)]
    );
    this.bidFormGroup = this.formBuilder.group({
      bidValue: this.bidValue
    });

    this.createAutoBidFormGroup();
  }
  onCheckChange(event) {
    if (this.autoBid) {
      if (event.target.checked) {
        this.autoBid.is_active = true;
      } else {
        this.autoBid.is_active = false;
      }
      this.updateAutoBid(this.autoBid);
    }
    else {
      if (event.target.checked) {
        this.createAutoBid();
      }
    }
  }
  createAutoBid(): void {
    const autobid: AutoBid = { made_by: this.currentUser.id, item: this.item.id, max_bid_value: 100, is_active: true }
    this.bidService.postAutoBid(autobid).subscribe(
      res => {
        this.autoBid = res;
        if (this.autoBid) {
          if (this.item.bids.length > 0) {
            const last_bid_made_by = this.item.bids[this.item.bids.length - 1][`made_by`];
            if (this.currentUser.id !== last_bid_made_by) {
              this.submitBid();
            }
          } else { this.submitBid(); }
        }
      }, err => { console.error(err); }
    );
  }
  createAutoBidFormGroup(): void {
    this.enableAutobidding = new FormControl(false);
    this.autoBidFormGroup = this.formBuilder.group({
      enableAutobidding: this.enableAutobidding
    });
  }
  openAutoBidConf(): void {
    this.isAutoBidOpen = !this.isAutoBidOpen;
    if (this.isAutoBidOpen) {
      this.getClientAutoBids();
    }
  }

  onAutoBidConfSaved(autobid: AutoBid): void {

    this.bidService.updateAutoBid(autobid).subscribe(
      res => {
        console.log('conf update -> ', res);
        this.getClientAutoBids();
      },
      err => {
        console.error(err);
      }
    );
  }

  

}
