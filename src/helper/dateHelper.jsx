export const validateAge = (value) => {
    if (!value) {
      return Promise.reject(new Error("Vui lòng chọn ngày sinh!"));
    }
  
    const currentDate = new Date();
    const selectedDate = value.toDate(); // Chuyển moment thành Date object
    const age = currentDate.getFullYear() - selectedDate.getFullYear();
  
    if (
      age > 16 ||
      (age === 16 &&
        currentDate >= new Date(selectedDate.setFullYear(selectedDate.getFullYear() + 16)))
    ) {
      return Promise.resolve();
    } else {
      return Promise.reject(new Error("Nhân viên phải trên 16 tuổi!"));
    }
  };
  