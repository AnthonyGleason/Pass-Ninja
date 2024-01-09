const USE_LOCALHOST:boolean = true;

export const getFetchURL = function():string{
  if (USE_LOCALHOST) return 'http://localhost:5000';
  return 'https://pass-ninja-4d4da81ae607.herokuapp.com'
}