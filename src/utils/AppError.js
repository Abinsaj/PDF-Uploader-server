function AppError(name, statusCode, description, isOperational) {
    // Create a new error object
    const error = new Error(description || 'An unexpected error occurred');

    // Add custom properties to the error object
    error.name = name || 'Error';
    error.statusCode = statusCode || 500;
    error.isOperational = typeof isOperational === 'boolean' ? isOperational : true;

    // Capture stack trace
    if (Error.captureStackTrace) {
        Error.captureStackTrace(error, AppError);
    }

    return error;
}

// Helper functions for specific error types
AppError.badRequest = function (message) {
    return AppError('BadRequest', 400, message || 'Bad Request', true);
};

AppError.unauthorized = function (message) {
    return AppError('Unauthorized', 401, message || 'Unauthorized', true);
};

AppError.forbidden = function (message) {
    return AppError('Forbidden', 403, message || 'Forbidden', true);
};

AppError.notFound = function (message) {
    return AppError('NotFound', 404, message || 'Not Found', true);
};

AppError.conflict = function (message) {
    return AppError('Conflict', 409, message || 'Conflict', true);
};

export default AppError