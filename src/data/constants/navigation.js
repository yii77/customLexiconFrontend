import { iconSource } from '../../presentation/style';

export const TABS = [
  {
    key: 'Practice',
    label: '首页',
    icon: iconSource.practice,
    stack: 'PracticeStack',
  },
  { key: 'Book', label: '词库', icon: iconSource.book, stack: 'BookStack' },
];

export const TAB_ROUTE_MAP = TABS.reduce((acc, tab) => {
  acc[tab.key] = tab.stack;
  return acc;
}, {});
