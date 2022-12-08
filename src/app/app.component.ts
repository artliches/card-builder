import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('showHideAnimation', [
      transition(':enter', [
        style({opacity: 0, scale: 0}),
        animate('.6s ease-in-out', style({opacity: 1, scale: 1}))
      ]),
      transition(':leave', [
        animate('.6s ease-in-out', style({opacity: 0, scale: 0}))
      ]),
    ]),
    trigger('slideLeft', [
      transition(':enter', [
        style({transform: 'translate3d(-300%, 0, 0'}),
        animate('400ms ease-in-out', style({transform: 'translate3d(0,0,0)'})),
      ]),
      transition(':leave', [
        animate('400ms ease-in-out', style({transform: 'translate3d(-300%, 0, 0)'}))
      ]),
    ]),
    trigger('slideRight', [
      transition(':enter', [
        style({transform: 'translate3d(300%, 0, 0'}),
        animate('400ms ease-in-out', style({transform: 'translate3d(0,0,0)'})),
      ]),
      transition(':leave', [
        animate('400ms ease-in-out', style({transform: 'translate3d(300%, 0, 0)'}))
      ]),
    ]),
    trigger('slideUp', [
      transition(':enter', [
        style({transform: 'translate3d(0, 300%, 0'}),
        animate('400ms ease-in-out', style({transform: 'translate3d(0,0,0)'})),
      ]),
      transition(':leave', [
        animate('400ms ease-in-out', style({transform: 'translate3d(0, 300%, 0)'}))
      ]),
    ]),
  ]
})
export class AppComponent implements OnInit {
  @ViewChild('fileUploadInput', {static: false}) inputRef: any;

  cardData = new FormGroup({
    itemName: new FormControl(''),
    flavor: new FormControl(''),
    description: new FormControl(''),
    keywords: new FormControl(''),
  });

  cardDeck: Array<any> = [];
  clipBoard = '';
  showSidebar = true;
  cardDeckJSON = '';

  ngOnInit() {
    const lStore = window.localStorage.getItem('card_builder_deck');
    if (lStore) {
      this.cardDeck.push(...JSON.parse(lStore));
    }
  }

  clearDeck() {
    this.cardDeck = [];
    window.localStorage.removeItem('card_builder_deck');
  }

  clearForm() {
    this.cardData.reset();
  }

  copyCard(index: number) {
    const cardData = this.cardDeck[index];
    const title = `__**${cardData.itemName.toUpperCase()}**__\r\n`;
    const flavor = `*${cardData.flavor}*\r\n`;
    const descrip = `${cardData.description}\r\n`;
    const keywords = `\r\n*__KEYWORDS:__ ${cardData.keywords.toLowerCase().trim()}*`;
    
    this.clipBoard =
      title + flavor + descrip + keywords;

    navigator.clipboard.writeText(this.clipBoard);
  }

  onSubmit() {
    this.cardDeck.push(this.cardData.value);
    window.localStorage.setItem('card_builder_deck', JSON.stringify(this.cardDeck));
  }

  download() {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.cardDeck));
    const dlAnchorElem = document.getElementById('downloadAnchorElem');

    if (dlAnchorElem) {
      dlAnchorElem.setAttribute('href', dataStr);
      dlAnchorElem.setAttribute('download', `cardDeck.json`);
    }
  }

  loadDeck(event: any) {
    const selectedFile = event.target.files[0];
    const fileReader = new FileReader();

    fileReader.readAsText(selectedFile, 'UTF-8');
    fileReader.onload = () => {
      if (fileReader.result?.toString()) {
        this.cardDeck = JSON.parse(fileReader.result.toString());
        window.localStorage.setItem('card_builder_deck', JSON.stringify(this.cardDeck));
        this.reset();
      }
    };
    fileReader.onerror = (error) => {
      console.log(error);
    };
  }

  reset() {
    this.inputRef.nativeElement.value = '';
  }

  remove(event: any) {
    this.cardDeck.splice(event, 1);
    window.localStorage.setItem('card_builder_deck', JSON.stringify(this.cardDeck));
  }

  showClearButton(): boolean {
    return this.cardData.value.itemName || this.cardData.value.flavor || this.cardData.value.description || this.cardData.value.keywords;
  }
}
