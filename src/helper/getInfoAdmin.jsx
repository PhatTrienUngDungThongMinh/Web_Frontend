export const getEmployeeName = () => {
    const employeeData = localStorage.getItem('employee');
    if (employeeData) {
        try {
            const employee = JSON.parse(employeeData);
            const nameUser = employee?.data?.FullName || "admin";
            return nameUser;
        } catch (error) {
            console.error('Error parsing employee data:', error);
        }
    }
    return "admin";
}

export const getPositionName = () => {
    const positionName = localStorage.getItem('Position') || "Unknown Position";     
    return positionName;
}

export const getEmployeeLogin = () => {
    const employeeData = localStorage.getItem('employee');
    if (employeeData) {
        try {
            const employee = JSON.parse(employeeData);
            return employee;
        } catch (error) {
            console.error('Error parsing employee data:', error);
        }
    }
    return null;
}


