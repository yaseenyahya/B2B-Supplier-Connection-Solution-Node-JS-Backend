import {
  CROP_IMAGE_MODAL_TOGGLE,
  CROP_IMAGE_MODAL_IMAGE,
  CROP_IMAGE_MODAL_CROP,
  CROP_IMAGE_MODAL_ZOOM,
  CROP_IMAGE_MODAL_ASPECT,
  CROP_IMAGE_MODAL_LOADING,
  CROP_IMAGE_MODAL_CROPPED_AREA_PIXELS,
  CROP_IMAGE_MODAL_RESET
} from "../ActionTypes";

export const CropImageModalReducer = (
  state = {
    cropImageModalToggle: false,
    cropImageModalImage: null,
    cropImageModalCrop: { x: 0, y: 0 },
    cropImageModalZoom: 1,
    cropImageModalAspect: 4 / 3,
    cropImageModalLoading: false,
    cropImageModalCroppedAreaPixels: null,
  },
  action
) => {
  switch (action.type) {
    case CROP_IMAGE_MODAL_TOGGLE:
      return Object.assign({}, state, {
        cropImageModalToggle: action.payload.cropImageModalToggle,
      });
    case CROP_IMAGE_MODAL_IMAGE:
      return Object.assign({}, state, {
        cropImageModalImage: action.payload.cropImageModalImage,
      });
    case CROP_IMAGE_MODAL_CROP:
      return Object.assign({}, state, {
        cropImageModalCrop: action.payload.cropImageModalCrop,
      });
    case CROP_IMAGE_MODAL_ZOOM:
      return Object.assign({}, state, {
        cropImageModalZoom: action.payload.cropImageModalZoom,
      });
    case CROP_IMAGE_MODAL_ASPECT:
      return Object.assign({}, state, {
        cropImageModalAspect: action.payload.cropImageModalAspect,
      });
    case CROP_IMAGE_MODAL_LOADING:
      return Object.assign({}, state, {
        cropImageModalLoading: action.payload.cropImageModalLoading,
      });
    case CROP_IMAGE_MODAL_CROPPED_AREA_PIXELS:
      return Object.assign({}, state, {
        cropImageModalCroppedAreaPixels:
          action.payload.cropImageModalCroppedAreaPixels,
      });
      case CROP_IMAGE_MODAL_RESET:
        return Object.assign({}, state, {
          cropImageModalToggle: false,
          cropImageModalImage: null,
          cropImageModalCrop: { x: 0, y: 0 },
          cropImageModalZoom: 1,
          cropImageModalAspect: 4 / 3,
          cropImageModalLoading: false,
          cropImageModalCroppedAreaPixels: null,
        });
    default:
      return state;
  }
};
