import {View, Text,FlatList, Animated,useWindowDimensions, TouchableOpacity} from 'react-native'
import React, {useState, useRef} from 'react'
import { ScreenStyles } from './Screen'
import DrawerButton from '../navigation/CustomDrawerButton'
import SurveyModal from './SurveyModal'
import Paginator from '../navigation/Paginator'

const DATA = [
    {
      id: '0',
      title: 'First Item',
    },
    {
      id: '1',
      title: 'Second Item',
    },
    {
      id: '2',
      title: 'Third Item',
    },
  ];
export default function SurveyBoard() {

    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollx  = useRef(new Animated.Value(0)).current;
    const slideRef = useRef(null);
    const {width} = useWindowDimensions();
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
        <View style={[{flex:0.8, marginHorizontal:10,marginBottom:10}, ScreenStyles.modal]}>
        <View style={[{flex:3}]}>
        <FlatList 
    data={DATA} renderItem={({item}) => <SurveyModal data={DATA} scrollX={scrollx} item={item}
    
    />}
    
    horizontal
    showsHorizontalScrollIndicator={false}
    pagingEnabled
    bounces={false}
    keyExtractor={(item)=>item.id}
    onScroll={Animated.event([{nativeEvent:{contentOffset:{x:scrollx}}}], {
        useNativeDriver:false,
    })}
    scrollEventThrottle={32}
    onViewableItemsChanged={viewableItemsChanged}
    viewabilityConfig={viewConfig}
    
    />
      <View style={[{flex:0.2,paddingTop:10, justifyContent:"center", alignItems:"center"}]}>
      <Paginator data={DATA} scrollX={scrollx}/>
      <View style ={{flex:1, justifyContent:"flex-end", alignItems:"flex-end", width:width-20, paddingRight:20, paddingBottom:20}}>
        <TouchableOpacity style={{backgroundColor:"darkblue",borderRadius:10,height:50, width:100}}><Text style={{ textAlign:"center", color:"white", fontSize:20, padding:10}}>Next</Text></TouchableOpacity>
      </View>
      <View/>
      
    </View>
    </View>
    
        </View>


  
  
        </View>
    )
}

