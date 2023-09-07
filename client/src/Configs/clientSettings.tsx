const useLocalhost:boolean = false;

export const getFetchURL = function():string{
  if (useLocalhost) return 'http://localhost:5000';
  return 'https://pass-ninja-519d509ea28a.herokuapp.com'
}