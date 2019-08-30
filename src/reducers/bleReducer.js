import {
  SCAN_DEVICE,
  ADD_DEVICE,
  REMOVE_DEVICE,
  CLEAR_DEVICE,
  CONNECT_DEVICE,
  DISCONNECT_DEVICE,
} from '../actions/types.js';

const initialState = {
  deviceMap: new Map(),
  devices: [],
  connectedDevice: null,
};

function bleReducer(state = initialState, action) {
  const { type, payload } = action;
  if (type === ADD_DEVICE) {
    const map = new Map(state.deviceMap);
    if (!state.connectedDevice
      || state.connectedDevice.id !== payload.device.id) {
      map.set(payload.device.id, payload.device);
    }
    return Object.assign({}, state, {
      deviceMap: map,
      devices: [...map.values()],
    });
  }
  if (type === REMOVE_DEVICE) {
    const map = new Map(state.deviceMap);
    map.delete(payload.device.id);
    return Object.assign({}, state, {
      deviceMap: map,
      devices: [...map.values()],
    });
  }
  if (type === CLEAR_DEVICE) {
    return Object.assign({}, state, {
      deviceMap: new Map(),
      devices: [],
    });
  }
  if (type === CONNECT_DEVICE) {
    const map = new Map(state.deviceMap);
    if (map.has(payload.device.id)) {
      map.delete(payload.device.id);
    }
    return Object.assign({}, state, {
      deviceMap: map,
      devices: [...map.values()],
      connectedDevice: payload.device,
    });
  }
  if (type === DISCONNECT_DEVICE) {
    const map = new Map(state.deviceMap);
    if (state.connectedDevice) {
      map.set(state.connectedDevice.id, state.connectedDevice);
    }    
    return Object.assign({}, state, {
      deviceMap: map,      
      devices: [...map.values()],
      connectedDevice: null,
    });
  }
  return state;
}

export default bleReducer;

