import assets from '../images';

export const BottomNavBarSection = [
  {
    title: 'Tips',
    showName: true,
    routeName: 'Tips',
    unselectedIcon: assets.tipsBlack,
    selectedIcon: assets.tipsWhite,
  },
  {
    title: 'News',
    showName: true,
    routeName: 'News',
    unselectedIcon: assets.newsBlack,
    selectedIcon: assets.newsWhite,
  },
];

export const ChatList = [
  {
    name: 'Crypto Channel',
    desc: 'Lorem epsem ke kddssdsdsds lhiin hfkg',
    date: '10 May',
    count: 2,
  },
  {
    name: 'Crypto Channel',
    desc: 'Lorem epsem ke kddssdsdsds lhiin hfkg',
    date: '11 May',
    count: 3,
  },
  {
    name: 'Crypto Channel',
    desc: 'Lorem epsem ke kddssdsdsds lhiin hfkg',
    date: '12 May',
    count: 2,
  },
];

export const dummyChatArray = [
  {
    type: 'admin',
    adminDetail: {
      name: 'Admin',
    },
    time: '1m ago',
    message: 'Hi, Alex John',
  },
  {
    type: 'admin',
    adminDetail: {
      name: 'Admin',
    },
    time: '1m ago',
    message: 'How about you?',
  },
  {
    type: 'admin',
    adminDetail: {
      name: 'Admin',
    },
    time: '1m ago',
    message: 'How about you?',
  },
  {
    type: 'user',
    adminDetail: {
      name: 'User',
    },
    time: '1m ago',
    message: 'fine',
  },
  {
    type: 'user',
    adminDetail: {
      name: 'User',
    },
    time: '2m ago',
    message: 'I am good',
  },
  {
    type: 'admin',
    adminDetail: {
      name: 'Admin',
    },
    time: '1m ago',
    message: 'How about you?',
  },
  {
    type: 'admin',
    adminDetail: {
      name: 'Admin',
    },
    time: '1m ago',
    message: 'How about you?',
  },
  {
    type: 'user',
    adminDetail: {
      name: 'User',
    },
    time: '2m ago',
    message: 'I am good',
  },
  {
    type: 'user',
    adminDetail: {
      name: 'User',
    },
    time: '2m ago',
    message: 'I am good',
  },
  {
    type: 'user',
    adminDetail: {
      name: 'User',
    },
    time: '2m ago',
    message: 'I am good',
  },
  {
    type: 'admin',
    adminDetail: {
      name: 'Admin',
    },
    time: '1m ago',
    message: 'How about you? dsldsldjs sdljsjkdskldj',
  },
  {
    type: 'admin',
    adminDetail: {
      name: 'Admin',
    },
    time: '1m ago',
    message: 'How about you?',
  },
  {
    type: 'admin',
    adminDetail: {
      name: 'Admin',
    },
    time: '1m ago',
    message: 'How about you?',
  },
];

export const EmojiesArray = [
  {image: assets.like, value: 'like'},
  {image: assets.heart, value: 'heart'},
  {image: assets.faceWithTears, value: 'face_with_tear'},
  {image: assets.anxiousFace, value: 'anxious_face'},
  {image: assets.tear, value: 'tear'},
];

export const getEmojiFunction = react_type => {
  if (react_type === 'like') {
    return assets.smallIcon4;
  } else if (react_type === 'heart') {
    return assets.smallIcon2;
  } else if (react_type === 'face_with_tear') {
    return assets.smallIcon3;
  } else if (react_type === 'anxious_face') {
    return assets.smallIcon5;
  } else {
    return assets.smallIcon1;
  }
};
