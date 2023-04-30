import {Platform, Dimensions, StyleSheet} from 'react-native';
import colors from '../colors';
import fonts from '../fonts';

export function normalize(size) {
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
}

const {width, height} = Dimensions.get('window');

export default StyleSheet.create({
  flex: size => ({flex: Number(size)}),
  flexDirection: z => ({flexDirection: z}),
  fontSize: size => ({fontSize: Number(size)}),
  color: color => ({color: color}),
  backgroundColor: color => ({backgroundColor: color}),
  alignself: z => ({alignSelf: z}),
  alignItems: z => ({alignItems: z}),
  flexGrow: z => ({flexGrow: z}),
  justifyContent: z => ({justifyContent: z}),
  full_Height: H => ({height: H ? height / Number(H) : height}),
  maxHeight: H => ({maxHeight: H ? Number(H) : height}),
  maxHeightPct: H => ({maxHeight: H}),
  height_width: (H, W) => ({height: Number(H), width: Number(W)}),
  Divide_width: W => ({width: width / Number(W)}),
  width: W => ({width: Number(W)}),
  width_Percent: W => ({width: W}),
  height: H => ({height: Number(H)}),
  lineHeight: size => ({lineHeight: Number(size)}),
  fontWeight: size => ({fontWeight: size}),
  fontColor: color => ({color: colors[color]}),
  padding: size => ({padding: Number(size)}),
  margin: size => ({margin: Number(size)}),
  mT: size => ({marginTop: Number(size)}),
  mL: size => ({marginLeft: Number(size)}),
  mR: size => ({marginRight: Number(size)}),
  mB: size => ({marginBottom: Number(size)}),
  mV: size => ({marginVertical: Number(size)}),
  mH: size => ({marginHorizontal: Number(size)}),
  pT: size => ({paddingTop: Number(size)}),
  pB: size => ({paddingBottom: Number(size)}),
  pL: size => ({paddingLeft: Number(size)}),
  pR: size => ({paddingRight: Number(size)}),
  pH: size => ({paddingHorizontal: Number(size)}),
  pV: size => ({paddingVertical: Number(size)}),
  bR: size => ({borderRadius: Number(size)}),
  top: size => ({top: Number(size)}),
  bottom: size => ({bottom: Number(size)}),
  left: size => ({left: Number(size)}),
  right: size => ({right: Number(size)}),
  zIndex: index => ({zIndex: index}),
  bw: size => ({borderWidth: Number(size)}),
  textAlign: z => ({textAlign: z}),
  alertTitle: {
    fontSize: 18,
    fontFamily: fonts.TitilliumWebBold,
    color: colors.black,
  },
  alertText: {
    fontSize: 14,
    fontFamily: fonts.PoppinsRegular,
    color: colors.paragColor,
  },
  alertWrapper: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    elevation: 10,
    flexDirection: 'row',
    flex: 1,
  },
  cardShadow: {
    shadowColor: '#EBEBEA',
    shadowOpacity: 0.9,
    shadowOffset: {width: 1, height: 0.9},
    ...Platform.select({
      ios: {
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#fafbfb',
      },
      android: {
        elevation: 5, // need to fix
        borderColor: '#fff',
      },
    }),
  },
});
