/* eslint-disable max-len */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const navigation: FuseNavigationItem[] = [
  {
    id       : 'main',
    title    : '',
    type     : 'group',
    children : [
      {
        id       : 'Dashboard',
        title    : 'Dashboard',
        type     : 'basic',
        icon     : 'taskezy:te_web_dashboard',
        link      : '/pages/home'
      },
    ]
  },
  {
    id       : 'network',
    title    : 'NETWORK',
    type     : 'group',
    children : [
      {
        id: 'clients',
        title: 'Clients',
        icon: 'taskezy:te_web_clients',
        type: 'basic',
        link: '/pages/list-clients',
      },
      {
        id:  'list-venues',
        title: 'Venues',
        icon: 'taskezy:te_web_venue',
        type: 'basic',
        link: '/pages/list-venues',
      },
      {
        id: 'suppliers',
        title: 'Suppliers',
        icon: 'taskezy:te_web_supplier',
        type: 'basic',
        link: '/pages/list-suppliers',
      },
      {
        id: 'resources',
        title: 'Resources',
        icon: 'taskezy:te_web_resource',
        type: 'basic',
        link: '/pages/list-resources',
      }
    ]
  },
  {
    id       : 'tasks',
    title    : 'TASKS',
    type     : 'group',
    children : [
      {
        id             : 'roster',
        title          : 'Roster',
        type           : 'basic',
        icon           : 'taskezy:te_web_roster',
        link            : '/pages/roster',
      },
      {
        id       : 'register',
        title    : 'Timesheet Register',
        type     : 'basic',
        icon     : 'taskezy:te_web_timesheet-register',
        link      : '/pages/timesheet-register',
      }
    ]
  },
  {
    id       : 'reports',
    title    : 'REPORTS',
    type     : 'group',
    children : [
      {
        id     : 'incident-report',
        title  : 'Incident Report',
        type   : 'basic',
        icon   : 'taskezy:te_web_incident-report',
        link    : '/pages/incident-reporting',
      },
    ]
  },
  // {
  //   id       : 'templates',
  //   title    : 'TEMPLATES',
  //   type     : 'group',
  //   children : [
  //     {
  //       id             : 'interviews',
  //       title          : 'Interviews',
  //       type           : 'basic',
  //       icon           : 'taskezy:te_web_Interviews',
  //       link            : '/pages/interviews',
  //     },
  //     // {
  //     //   id:  'forms',
  //     //   title: 'Forms',
  //     //   icon: 'business_center',
  //     //   type: 'basic',
  //     //   link: '/pages/forms'
  //     // },
  //   ]
  // },
  {
    id       : 'account',
    title    : 'ACCOUNT',
    type     : 'group',
    children : [
      {
        id       : 'details',
        title    : 'Details',
        type     : 'basic',
        icon     : 'taskezy:te_web_Details',
        link     : '/pages/details',
      },
      {
        id       : 'members',
        title    : 'Members',
        type     : 'basic',
        icon     : 'taskezy:te_web_members',
        link     : '/pages/list-members',
      },
      {
        id       : 'audit-log',
        title    : 'Logs',
        type     : 'basic',
        icon     : 'taskezy:te_web_logs',
        link     : '/pages/audit-log',
      },
  //   ]
  // },
  // {
      // id       : 'others',
      // type     : 'group',
      // children : [
        // {
        //   id             : 'swap-profile',
        //   title          : 'Swap Profile',
        //   type           : 'basic',
        //   icon           : 'swap_horiz',
        //   link            : '/pages/my-profiles'
        // },
        // {
        //    id            : 'resource-pool',
        //    title         : 'Resource Pool',
        //    type          : 'basic',
        //    icon          : 'assignment_ind',
        //    link          : '/pages/resource-pool'
        // }
      ]
  }
];
