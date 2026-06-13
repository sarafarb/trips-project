export const ValidatorsUtil = {
  isStrongPassword(password: string): boolean {
    return password.length >= 6; // ניתן להרחיב לרג'קס מורכב יותר
  }
};