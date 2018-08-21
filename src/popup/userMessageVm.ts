const MessageClasses = {
  Error: "error",
  Success: "success"
};

class UserMessage {
  domUserMessage: HTMLElement;
  userMessageId: string = "userMessage";

  constructor() {
    document.addEventListener("DOMContentLoaded", () => {
      this.domUserMessage = document.getElementById(this.userMessageId);

      if (!this.domUserMessage) {
        const msg = document.createElement("div");
        msg.id = this.userMessageId;
        document.body.appendChild(msg);
        this.domUserMessage = msg;
      }
    });
  }

  public error = (
    userMessage: string,
    logMessage: string = null,
    ex: any = null
  ) => {
    this.domUserMessage.className = MessageClasses.Error;
    this.message(userMessage);
    if (logMessage || ex) {
      console.error(logMessage, ex);
    }
  };

  public success = (userMessage: string) => {
    this.domUserMessage.className = MessageClasses.Success;
    this.message(userMessage);
  };

  public message = (userMessage: string) => {
    this.domUserMessage.className = MessageClasses.Success;
    this.domUserMessage.innerHTML = userMessage;
    window.setTimeout(() => (this.domUserMessage.innerHTML = ""), 5000);
  };
}

const messenger = new UserMessage();
export default messenger;
