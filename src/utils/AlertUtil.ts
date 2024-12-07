import { message } from 'ant-design-vue';

export function warningAlert(msg: string) {
  message.warning(msg)
}

export function successAlert(msg: string) {
  message.success(msg)
}