// Helper.js is a global file that provides mutli use 
// helper functions for use within the application.

// TODO: verify the logic; do we only ever want 2 initials?
export const getUserInitials = displayName => {
    // Returns full name initials if seperated by a space
    if (displayName.includes(' ')) {
        return displayName.split(' ').map(name => name[0]).join('');
    //Returns first initial if there's not a space and displayName is not an email
    } else if (!displayName.includes('@')) {
        return displayName[0];
        // Returns email prefix if displayName an email
    } else if (displayName.includes('@')) {
        return displayName.split('@')[0];
    } else {
        return 'NA';
    }
}