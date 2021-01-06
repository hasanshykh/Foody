import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Plugins, Capacitor, CameraSource, CameraResultType } from '@capacitor/core';
import { AlertController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
})
export class ImagePickerComponent implements OnInit {
  @ViewChild('filePicker') filePickerRef: ElementRef<HTMLInputElement>;
  @Output() imagePick = new EventEmitter<string | File>();
  selectedImage: string;
  usePicker = false;

  constructor(private platForm: Platform, private alerCtrl: AlertController) { }

  ngOnInit() {
    if ((this.platForm.is('mobile') && !this.platForm.is('hybrid')) || this.platForm.is('desktop')) {
      this.usePicker = true;
    }
  }

  onPickImage() {
    if (!Capacitor.isPluginAvailable('Camera') || this.usePicker) {
      this.filePickerRef.nativeElement.click();
      return;
    }
    Plugins.Camera.getPhoto({
      quality: 90,
      source: CameraSource.Prompt,
      correctOrientation: true,
      height: 320,
      width: 200,
      resultType: CameraResultType.Base64
    }).then(image => {
      this.selectedImage = image.base64String;
      this.imagePick.emit(image.base64String);
    }).catch(err => {
      console.log(err);
      return;
    });
  }
  
  onFilechosen(event: Event) {
    const pickedFile = (event.target as HTMLInputElement).files[0];
    if (!pickedFile) {
      this.alerCtrl.create({
        header: 'Not found',
        message: 'File not picked!',
        buttons: ['Okay']
      }).then(show => {
        show.present();
      });
      return;
    }
    const fileR = new FileReader();
    fileR.onload = () => {
      const dataUrl = fileR.result.toString();
      this.selectedImage = dataUrl;
      this.imagePick.emit(pickedFile);
    };
    fileR.readAsDataURL(pickedFile);
  }
}

