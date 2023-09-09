const USE_LOCALHOST:boolean = true;

export const getFetchURL = function():string{
  if (USE_LOCALHOST) return 'http://localhost:5000';
  return 'https://pass-ninja-519d509ea28a.herokuapp.com'
}