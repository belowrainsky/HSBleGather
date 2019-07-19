import {
  SCAN_DEVICE,
  ADD_DEVICE,
  REMOVE_DEVICE,
  CLEAR_DEVICE,
  CONNECT_DEVICE,
  DISCONNECT_DEVICE,
} from './types.js';

export function scanDevice(payload) {
  return { type: SCAN_DEVICE, payload };
};

export function addDevice(payload) {
  return { type: ADD_DEVICE, payload };
};

export function removeDevice(payload) {
  return { type: REMOVE_DEVICE, payload };
};

export function clearDevice(payload) {
  return { type: CLEAR_DEVICE, payload };
};

export function connectDevice(payload) {
  return { type: CONNECT_DEVICE, payload };
};

export function disconnectDevice(payload) {
  return { type: DISCONNECT_DEVICE, payload };
};

