export const editAndFilterOnly = {
  list: false,
  show: false,
  edit: true,
  filter: true,
};
export const filterOnly = {
  list: false, show: false, edit: true, filter: true,
};
export const showOnly = {
  list: false, show: true, edit: false, filter: true,
};

type SORT = {
  direction: 'desc' | 'asc';
  sortBy: string;
}
export const CREATE_DATE__DESC: SORT = {
  direction: 'desc',
  sortBy: 'createDate',
};
export const CREATED_AT__DESC: SORT = {
  direction: 'desc',
  sortBy: 'createdAt',
};
