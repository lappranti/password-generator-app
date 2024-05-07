import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from './snack-bar/snack-bar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  password = '';
  placeholder = 'PIx1f5DaFX';
  key: string = 'config_password_key';
  passwordLength = 10;

  strength = [{}, {}, {}, {}];

  includeLowercase = true;
  includeUppercase = true;
  includeNumbers = true;
  includeSymbols = false;

  strengthPassword!: string;
  strengthClass!: string;
  messageAfterCopy: string = '';

  durationInSeconds = 1.5;

  constructor(private _snackBar: MatSnackBar) {
    this.getConfigPassword();
    this.generatePassword();
  }

  ngOnInit(): void {
    this.generatePassword();
  }

  @ViewChild('range') rangeEl!: ElementRef;
  @ViewChild('sliderValue') sliderValue!: ElementRef;

  ngAfterViewInit(): void {
    let progress: number = this.passwordLength * 5;
    this.rangeEl.nativeElement.style.background = `linear-gradient(to right, #A4FFAF ${progress}%, #18171F ${progress}%)`;

    this.rangeEl.nativeElement.addEventListener('input', (event: Event) => {
      const rangeValue = (event.target as HTMLInputElement).value;
      this.sliderValue.nativeElement.textContent = rangeValue;

      progress = (Number(rangeValue) / this.rangeEl.nativeElement.max) * 20 * 5;

      this.rangeEl.nativeElement.style.background = `linear-gradient(to right, #A4FFAF ${progress}%, #18171F ${progress}%)`;
    });
  }

  generatePassword() {
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_+';

    const trueValues = this.calculateNbrChecked();
    if (trueValues == 0 || this.passwordLength < 4) {
      this.openSnackBar(`Quelque chose s'est mal passé !!`);
      return;
    }
    this.generateStrengthText(trueValues);

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

    let generatedPassword = '';
    for (let i = 0; i < this.passwordLength; i++) {
      const randomIndex = Math.floor(Math.random() * validChars.length);
      generatedPassword += validChars[randomIndex];
    }
    this.password = generatedPassword;
    this.stockConfigPassword();
  }

  calculateNbrChecked() {
    let listOptionsCheck = [
      this.includeLowercase,
      this.includeUppercase,
      this.includeNumbers,
      this.includeSymbols,
    ];

    const trueValues = listOptionsCheck.filter(
      (option) => option === true
    ).length;
    return trueValues;
  }

  generateStrengthText(nbrCheckedOptions: number) {
    if (nbrCheckedOptions == 1) {
      this.strengthPassword = 'TOO WEAK!';
      this.strengthClass = 'un';
    } else if (nbrCheckedOptions == 2) {
      this.strengthPassword = 'WEAK';
      this.strengthClass = 'deux';
    } else if (nbrCheckedOptions == 3) {
      this.strengthPassword = 'MEDIUM';
      this.strengthClass = 'trois';
    } else if (nbrCheckedOptions == 4) {
      this.strengthPassword = 'STRONG';
      this.strengthClass = 'quatre';
    }
  }

  stockConfigPassword() {
    let listOptionsCheck = [
      {
        label: 'includeLowercase',
        value: this.includeLowercase,
      },
      {
        label: 'includeUppercase',
        value: this.includeUppercase,
      },
      {
        label: 'includeNumbers',
        value: this.includeNumbers,
      },
      {
        label: 'includeSymbols',
        value: this.includeSymbols,
      },
    ];

    listOptionsCheck = listOptionsCheck.filter(
      (option) => option.value === true
    );
    const config = {
      passwordLength: this.passwordLength,
      checkedOptions: listOptionsCheck,
    };
    localStorage.setItem(this.key, JSON.stringify(config));
  }

  getConfigPassword() {
    const config = JSON.parse(localStorage.getItem(this.key) || '');
    console.log(config);
    this.passwordLength = config.passwordLength;
  }

  onChecked() {
    this.generateStrengthText(this.calculateNbrChecked());
  }

  copyToClipboard() {
    navigator.clipboard
      .writeText(this.password)
      .then(() => {
        this.messageAfterCopy = 'Mot de passe copié !';
        this.openSnackBar(this.messageAfterCopy);
      })
      .catch((err) => {
        this.messageAfterCopy = `Mot de passe non copié !`;
        this.openSnackBar(this.messageAfterCopy);
      });
  }

  openSnackBar(message: string) {
    this._snackBar.openFromComponent(SnackBarComponent, {
      data: { message: message },
      duration: this.durationInSeconds * 1000,
    });
  }
}
