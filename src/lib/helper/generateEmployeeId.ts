export const generateEmployeeId = (role: string): string => {
    const length = 6; // Default length
  const randomSuffix = Math.random()
    .toString(36)
    .substring(2, length + 2);
  let prefix = "EMP"; // Default prefix

  switch (role.toUpperCase()) {
    case "HR":
      prefix = "HR";
      break;
    case "EMPLOYEE":
      prefix = "EMP";
      break;
    // Add more cases as needed

    // Default case for unknown roles
    default:
      break;
  }

  return `${prefix}${randomSuffix.toUpperCase()}`;
};

// // Example usage:
// const employeeId: string = generateEmployeeId("HR");
// console.log(employeeId);
