
export function validateImageSelected(image) {
  if (!image) {
    return "Please select a vehicle image.";
  }

  return null;
}

/**
 * Check that the uploaded file is an image.
 */
export function validateImageType(image) {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp"
  ];

  if (!allowedTypes.includes(image.type)) {
    return "Only JPG, JPEG, PNG and WEBP images are allowed.";
  }

  return null;
}

/**
 * Check that the image size is not larger than 5MB.
 */
export function validateImageSize(image) {
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (image.size > maxSize) {
    return "Image size must not exceed 5MB.";
  }

  return null;
}

/**
 * Run all image validations.
 */
export function validateVehicleImage(image) {

  let error = validateImageSelected(image);

  if (error) return error;

  error = validateImageType(image);

  if (error) return error;

  error = validateImageSize(image);

  if (error) return error;

  return null;
}