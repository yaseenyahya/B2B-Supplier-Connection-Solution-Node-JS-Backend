import {
  CROP_IMAGE_MODAL_TOGGLE,
  CROP_IMAGE_MODAL_IMAGE,
  CROP_IMAGE_MODAL_CROP,
  CROP_IMAGE_MODAL_ZOOM,
  CROP_IMAGE_MODAL_ASPECT,
  CROP_IMAGE_MODAL_LOADING,
  CROP_IMAGE_MODAL_CROPPED_AREA_PIXELS,
  CROP_IMAGE_MODAL_RESET,
} from "../ActionTypes";

export const setCropImageModalToggle = (cropImageModalToggle) => {
  return {
    type: CROP_IMAGE_MODAL_TOGGLE,
    payload: {
      cropImageModalToggle: cropImageModalToggle,
    },
  };
};
export const setCropImageModalImage = (cropImageModalImage) => {
  return {
    type: CROP_IMAGE_MODAL_IMAGE,
    payload: {
      cropImageModalImage: cropImageModalImage,
    },
  };
};
export const setCropImageModalCrop = (cropImageModalCrop) => {
  return {
    type: CROP_IMAGE_MODAL_CROP,
    payload: {
      cropImageModalCrop: cropImageModalCrop,
    },
  };
};
export const setCropImageModalZoom = (cropImageModalZoom) => {
  return {
    type: CROP_IMAGE_MODAL_ZOOM,
    payload: {
      cropImageModalZoom: cropImageModalZoom,
    },
  };
};
export const setCropImageModalAspect = (cropImageModalAspect) => {
  return {
    type: CROP_IMAGE_MODAL_ASPECT,
    payload: {
      cropImageModalAspect: cropImageModalAspect,
    },
  };
};
export const setCropImageModalLoading = (cropImageModalLoading) => {
  return {
    type: CROP_IMAGE_MODAL_LOADING,
    payload: {
      cropImageModalLoading: cropImageModalLoading,
    },
  };
};

export const setCropImageModalCroppedAreaPixels = (
  cropImageModalCroppedAreaPixels
) => {
  return {
    type: CROP_IMAGE_MODAL_CROPPED_AREA_PIXELS,
    payload: {
      cropImageModalCroppedAreaPixels: cropImageModalCroppedAreaPixels,
    },
  };
};
export const setCropImageModalReset = () => {
  return {
    type: CROP_IMAGE_MODAL_RESET,
  };
};
