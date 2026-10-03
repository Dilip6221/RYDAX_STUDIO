export const otpValidationRules = {
    mobile: { required: true, message: "Mobile Number is required", pattern: /^\d{10}$/, patternMessage: "Mobile Number must be 10 digits" },
};
export const completeProfileValidationRules  = {
    name: { required: true, minLength: 3, message: "Name is required", minLengthMessage: "Name must be 3 characters" }
};

export const submitInquiryValidationRules = {
    name: { required: true, minLength: 3, message: "Name is required", minLengthMessage: "Name must be 3 characters" },
    phone: { required: true, message: "Mobile Number is required", pattern: /^\d{10}$/, patternMessage: "Mobile Number must be 10 digits" },
    // email: { required: true, message: "Email is required", pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    // city: { required: true, message: "City is required" },
    // address: { required: true, message: "Address is required" },
    // carBrand: { required: true, message: "Car brand is required" },
    // carModel: { required: true, message: "Car model is required" },
    services: { required: true, minLength: 1, message: "Please select at least one service" },
};

export const userCreateValidationRules = {
    name: { required: true, minLength: 3, message: "Name is required", minLengthMessage: "Name must be 3 characters" },
    phone: { required: true, message: "Mobile Number is required", pattern: /^\d{10}$/, patternMessage: "Mobile Number must be 10 digits" },
    role: { required: true, message: "Role is required" },
};

export const carCreateValidationRules = {
    userId: { required: true, message: "Please select a customer" },
    brand: { required: true, minLength: 1, message: "Brand is required" },
    model: { required: true, minLength: 1, message: "Model is required" },
    year: { required: true, pattern: /^\d{4}$/, patternMessage: "Enter a valid year (e.g. 2024)" },
    registrationNumber: { required: true, minLength: 3, message: "Registration number is required" },
    vinNumber: { required: false },
};

export const jobMediaValidationRules = {
    file: { required: true, message: "Please select a file to upload" },
    stage: { required: true, message: "Please select a stage" },
};

export const jobServiceValidationRules = {
    serviceName: { required: true, minLength: 2, message: "Service name is required", minLengthMessage: "Service name must be at least 2 characters" },
    price: { required: true, pattern: /^\d+(?:\.\d{1,2})?$/, patternMessage: "Enter a valid price" },
};

export const serviceCreateValidationRules = {
    title: { required: true, minLength: 3, message: "Title is required", minLengthMessage: "Title must be at least 3 characters" },
    shortDescription: { required: true, minLength: 10, message: "Short description is required", minLengthMessage: "Short description must be at least 10 characters" },
    description: { required: true, minLength: 20, message: "Full description is required", minLengthMessage: "Full description must be at least 20 characters" },
    status: { required: true, message: "Status is required" },
    image: { required: true, message: "Service image is required" },
};

export const galleryValidationRules = {
    title: { required: true, minLength: 3, message: "Title is required", minLengthMessage: "Title must be at least 3 characters" },
    service: { required: true, message: "Please select a service" },
    file: { required: true, message: "Please select an image file" },
};

export const blogCreateValidationRules = {
    title: { required: true, minLength: 5, message: "Title is required", minLengthMessage: "Title must be at least 5 characters" },
    category: { required: true, message: "Category is required" },
    content: { required: true, minLength: 20, message: "Content is required", minLengthMessage: "Content must be at least 20 characters" },
    thumbnail: { required: true, message: "Thumbnail is required" },
};
export const emailSubmitValidationRules = {
    email: { required: true, message: "Email is required", pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
};