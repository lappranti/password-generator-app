import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  password = '';
  placeholder = 'PIx1f5DaFX';
  passwordLength = 12;
  includeLowercase = true;
  includeUppercase = true;
  includeNumbers = false;
  includeSymbols = false;

  strengthPassword!: string;
  messageAfterCopy: string = '';

  ngOnInit(): void {
    this.strengthPassword = 'deux';
  }

  generatePassword() {
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_+';

    let validChars = '';
    if (this.includeLowercase) {
      validChars += lowercaseChars;
    }
    if (this.includeUppercase) {
      validChars += uppercaseChars;
    }
    if (this.includeNumbers) {
      validChars += numberChars;
    }
    if (this.includeSymbols) {
      validChars += symbolChars;
    }

    let listOptionsCheck = [
      this.includeLowercase,
      this.includeUppercase,
      this.includeNumbers,
      this.includeSymbols,
    ];
    const trueValues = listOptionsCheck.filter(
      (option) => option === true
    ).length;
    if (trueValues == 1) {
      this.strengthPassword = 'un';
    } else if (trueValues == 2) {
      this.strengthPassword = 'deux';
    } else if (trueValues == 3) {
      this.strengthPassword = 'trois';
    } else if (trueValues == 4) {
      this.strengthPassword = 'quatre';
    }

    let generatedPassword = '';
    for (let i = 0; i < this.passwordLength; i++) {
      const randomIndex = Math.floor(Math.random() * validChars.length);
      generatedPassword += validChars[randomIndex];
    }

    this.password = generatedPassword;
    if (trueValues == 0) {
      this.password = '';
      this.placeholder = '...';
    }
  }

  onCheckClick(type: string) {
    if (type == 'lower') {
      this.includeLowercase = !this.includeLowercase;
    } else if (type == 'upper') {
      this.includeUppercase = !this.includeUppercase;
    } else if (type == 'number') {
      this.includeNumbers = !this.includeNumbers;
    } else {
      this.includeSymbols = !this.includeSymbols;
    }
  }

  copyToClipboard() {
    navigator.clipboard
      .writeText(this.password || this.placeholder)
      .then(() => {
        this.messageAfterCopy = 'Le texte a été copié dans le presse-papiers !';
        console.log(this.messageAfterCopy);
        setTimeout(() => {
          this.messageAfterCopy = '';
        }, 3000);
      })
      .catch((err) => {
        this.messageAfterCopy = 'Impossible de copier le texte : ';
        console.log(this.messageAfterCopy);
        setTimeout(() => {
          this.messageAfterCopy = '';
        }, 3000);
      });
  }
}
