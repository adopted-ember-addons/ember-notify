import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class IndexController extends Controller {
  @service notify;
  info = (model) => {
    this.showLevel('info',model)
  };
  alert = (model) => {
    this.showLevel('alert',model)
  };
  success = (model) => {
    this.showLevel('success',model)
  };
  warning = (model) => {
    this.showLevel('warning',model)
  };

  toggleHtml = () => {
    this.model.html = !this.model.html;
  };

  @action
  showLevel(level, model) {
    let message = {
      closeAfter: Number(model.closeAfter)
    };
    message[model.html ? 'html' : 'text'] = model.text;
    this.notify.show(level, message);
  }
}
