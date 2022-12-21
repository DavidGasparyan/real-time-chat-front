import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import { io } from "socket.io-client";

const SOCKET_ENDPOINT = 'http://localhost:3000';

@Component({
  selector: 'app-chat-inbox',
  templateUrl: './chat-inbox.component.html',
  styleUrls: ['./chat-inbox.component.sass']
})
export class ChatInboxComponent implements OnInit {
  socket!: any;
  message = '';

  @ViewChild('messageList') messageList!: ElementRef;

  constructor(
    private readonly renderer: Renderer2,
  ) {
  }

  ngOnInit() {
    this.socketConnect();
  }

  private socketConnect() {
    this.socket = io(SOCKET_ENDPOINT);

    this.socket.on('message-broadcast', (message: string) => {
      if (message.trim() !== '') {
        this.createListElement(message);
      }
    });
  }

  sendMessage() {
    if (this.message.trim() !== '') {
      this.socket.emit('message', this.message);
      this.createListElement(this.message);
      this.message = '';
    }
  }

  private createListElement(message: string) {
    const listElement = this.renderer.createElement('li');
    const messageList = this.messageList.nativeElement;

    this.renderer.setProperty(listElement, 'textContent', message);
    this.renderer.setStyle(listElement, 'background', 'white');
    this.renderer.setStyle(listElement, 'padding', '15px 30px');
    this.renderer.setStyle(listElement, 'margin', '10px');

    this.renderer.appendChild(messageList, listElement);
  }
}
