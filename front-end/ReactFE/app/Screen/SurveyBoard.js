import {View, Text,FlatList, Animated} from 'react-native'
import React, {useState, useRef} from 'react'
import { ScreenStyles } from './Screen'
import DrawerButton from '../navigation/CustomDrawerButton'
import SurveyModal from './SurveyModal'

const DATA = [
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      title: 'First Item',
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      title: 'Second Item',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      title: 'Third Item',
    },
  ];
export default function SurveyBoard() {

    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollx  = useRef(new Animated.Value(0)).current;
    const slideRef = useRef(null);
    
    const viewableItemsChanged = useRef(({viewableItems}) =>{
        setCurrentIndex(viewableItems[0].index);
    }).current;

    const viewConfig = useRef({viewAreaCoveragePercentThreshold:50}).current;
    return  (
        <View style={[ScreenStyles.ScreenStyle,{flex:1}]}>
        <DrawerButton/>
       
        <View style={{flex:0.2, justifyContent:"center", alignContent:"center"}}>
            <Text style={{color:"#fff", fontSize:50, fontWeight:"bold"}}>Survey</Text>
        </View>
        <View style={{flex:0.8}}>
        <View style={{flex:3}}>
        <FlatList contentContainerStyle={{ flexGrow: 1 }}
    data={DATA} renderItem={({item}) => <SurveyModal item={item}
    
    />}
    
    horizontal
    showsHorizontalScrollIndicator
    pagingEnabled
    bounces={false}
    keyExtractor={(item)=>item.id}
    onScroll={Animated.event([{nativeEvent:{contentOffset:{x:scrollx}}}], {
        useNativeDriver:false,
    })}
    scrollEventThrottle={32}
    onViewableItemsChanged={viewableItemsChanged}
    viewabilityConfig={viewConfig}
    ref={slideRef}
    
    />
    </View>
        </View>
    
        </View>
    )
}

