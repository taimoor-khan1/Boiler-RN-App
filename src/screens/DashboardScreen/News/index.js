import React, {useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import colors from '../../../assets/colors';
import fonts from '../../../assets/fonts';
import assets from '../../../assets/images';
import labels from '../../../assets/labels';
import styles from '../../../assets/styles';
import {CustomButtonComponent} from '../../../components/CustomUIComponents/CustomButton';
import {CustomNewsComponent} from '../../../components/CustomUIComponents/NewsComponent';
import {HeaderOneComponent} from '../../../components/HeaderComponents/Header1';
import {StatusBarComponent} from '../../../components/StatusBar/CustomStatusBar';
import {useSelector, useDispatch} from 'react-redux';
import {
  DeleteNewsMethod,
  GetNewsMethod,
} from '../../../store/actions/NewsAction';
import {delete_news, get_news} from '../../../config/apiActions';
import Spinner from 'react-native-loading-spinner-overlay';
import {CustomModalComponent} from '../../../components/CustomUIComponents/CustomModal';

const {width} = Dimensions.get('window');
const NewsScreen = ({navigation}) => {
  // All states declare here
  const [news, setNews] = useState([]);
  const {user} = useSelector(state => state?.Auth);
  const {newsList} = useSelector(state => state?.News);
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const [open, setOpen] = useState(false);
  const [newsId, setNewsId] = useState(null);
  const flatListRef = useRef();

  // fetch news here
  useEffect(() => {
    navigation.addListener('focus', async () => {
      fetchAllNewsMethod();
      scrollToTop();
    });
  }, []);

  // its run when newsList update
  useEffect(() => {
    let mappedOut = newsList?.map((item, index) => {
      return {
        ...item,
        link_object: JSON.parse(JSON.stringify(item?.link_object)),
      };
    });
    setNews(mappedOut);
  }, [newsList]);

  // when user come on news screen the list go to top .
  const scrollToTop = () => {
    flatListRef?.current?.scrollToOffset({animated: true, offset: 0});
  };

  // fetch all news method define here
  const fetchAllNewsMethod = () => {
    let data = {
      action: get_news,
    };
    dispatch(
      GetNewsMethod(
        data,
        () => {
          setLoader(false);
        },
        () => {
          setLoader(false);
        },
      ),
    );
  };

  // open delete modal here
  const onDeleteModal = id => {
    setNewsId(id);
    setOpen(true);
  };

  // delete news method define here
  const deleteNewsFromList = id => {
    setLoader(true);
    let data = {
      action: delete_news,
      id: newsId,
    };
    dispatch(
      DeleteNewsMethod(
        data,
        () => {
          setLoader(false);
          setOpen(false);
          setNewsId(null);
          fetchAllNewsMethod();
        },
        () => {
          setLoader(false);
        },
      ),
    );
  };
  //edit news method define here
  const onEditNewsFromList = (id, link, description) => {
    navigation.navigate('MainStackScreen', {
      screen: 'CreateNewsScreen',
      params: {newsId: id, news_Link: link, news_Description: description},
    });
  };

  // render news here
  const renderItem = ({item, index}) => {
    return (
      <CustomNewsComponent
        admin={user?.role === labels.administrator}
        item={item}
        onDeleteNews={() => onDeleteModal(item?.id)}
        onEditNews={() =>
          onEditNewsFromList(item?.id, item?.news_link, item?.description)
        }
      />
    );
  };

  // top header title method here
  const topHeaderTitleMethod = () => {
    return (
      <View style={styless.headerTitleWrapper}>
        <Text style={styless.helloText}>{labels.hello}</Text>
        <Text>, </Text>
        <Text style={styless.nameText}>{user?.name}</Text>
      </View>
    );
  };

  // delete modal content define here
  const deleteModalContent = () => {
    return (
      <View style={styless.modalContentWrapper}>
        <Image source={assets.deleteImage} resizeMode="contain" />
        <Text style={styless.wantText}>{labels.wantTo}</Text>
        <Text style={styless.areYouText}>{labels.areYou}</Text>
        <View style={styless.btnWrapper}>
          <CustomButtonComponent
            onPress={() => {
              setOpen(false);
            }}
            text={labels.cancel}
            bg={colors.cancelBtnColor}
            width={width / 3.5}
            height={50}
            imageShow={false}
            color={colors.black}
          />
          <CustomButtonComponent
            onPress={() => {
              deleteNewsFromList();
            }}
            text={labels.delete}
            bg={colors.red}
            width={width / 3.5}
            height={50}
            imageShow={false}
          />
        </View>
      </View>
    );
  };

  // render method here
  return (
    <ImageBackground
      source={assets.bgImage}
      resizeMode="cover"
      style={styless.container}>
      <StatusBarComponent
        bgColor={'transparent'}
        barStyle={labels.darkContent}
      />
      <Spinner
        visible={loader}
        textContent={labels.loading}
        textStyle={[styles.color(colors.white)]}
      />
      <View style={[styles.height(40)]} />
      <HeaderOneComponent
        text={topHeaderTitleMethod()}
        onPress={() => {
          navigation.navigate('MainStackScreen', {
            screen: 'Setting',
          });
        }}
      />
      <Text style={styless.newsTitle}>{labels.news}</Text>
      {news?.length ? (
        <FlatList
          ref={flatListRef}
          showsVerticalScrollIndicator={false}
          style={[styles.width_Percent('100%'), styles.flex(1)]}
          contentContainerStyle={styles.alignItems('center')}
          data={news}
          renderItem={renderItem}
        />
      ) : (
        <Text style={styless.noDataText}>{labels.noNewsAvailableYet}</Text>
      )}
      {user?.role === labels.administrator ? (
        <View style={{position: 'absolute', bottom: 10, alignSelf: 'center'}}>
          <CustomButtonComponent
            onPress={() => {
              navigation.navigate('MainStackScreen', {
                screen: 'CreateNewsScreen',
                params: {newsId: null, news_Link: null},
              });
            }}
            text={labels.addNews}
            bg={colors.theme_Color}
            width={width / 2.8}
            height={50}
            imageShow={true}
          />
          <CustomModalComponent
            open={open}
            setOpen={() => {
              setOpen(false);
            }}
            childern={deleteModalContent()}
          />
        </View>
      ) : null}
    </ImageBackground>
  );
};
const styless = StyleSheet.create({
  container: {
    flex: 1,
  },
  newsTitle: {
    marginLeft: 30,
    marginTop: 20,
    fontFamily: fonts.TitilliumWebBold,
    color: colors.black,
    fontSize: 16,
    marginBottom: 10,
  },
  headerTitleWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  helloText: {
    color: colors.black,
    fontFamily: fonts.TitilliumWebRegular,
    fontSize: 18,
  },
  nameText: {
    color: colors.black,
    fontFamily: fonts.TitilliumWebBold,
    fontSize: 18,
  },
  modalContentWrapper: {
    backgroundColor: colors.white,
    borderRadius: 26,
    width: width / 1.4,
    alignItems: 'center',
    paddingVertical: 15,
  },
  wantText: {
    color: colors.black,
    fontFamily: fonts.PoppinsSemiBold,
    fontSize: 18,
    marginTop: 15,
  },
  areYouText: {
    color: colors.paragColor,
    fontFamily: fonts.PoppinsRegular,
    fontSize: 16,
    marginTop: 5,
    marginBottom: 30,
    textAlign: 'center',
    width: width / 1.6,
  },
  btnWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '90%',
  },
  noDataText: {
    color: colors.placeHolderColor,
    fontFamily: fonts.PoppinsRegular,
    fontSize: 14,
    textAlign: 'center',
  },
});
export default NewsScreen;
