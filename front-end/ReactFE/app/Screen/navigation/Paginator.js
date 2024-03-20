import React from "react";

import { View, Text,StyleSheet, Animated, useWindowDimensions } from "react-native";

const Paginator = ({data,scrollX, index})=>{

    const {width} = useWindowDimensions();
   
    let page = (scrollX !==undefined && scrollX._value!==undefined && width) ? Math.round(scrollX._value /(width-20)) : 0;
    if (index!== undefined) page = index;
    return(

        <View style={{flexDirection:"row",height:64,}}>
            {data.map((_,i) =>{



                
                
                return <View style={[styles.dot]} key={i.toString()}>{page==i && <View style={styles.innerDot}/> }</View>
            })}
        </View>
    )
}


export default Paginator;


const styles = StyleSheet.create({
    dot:{
        justifyContent:"center",
        alignContent:"center",
        height:18,
        borderRadius:10,
       
        borderWidth: 3, 
        borderColor: 'black',
        marginHorizontal: 8,
        width:18,
    },
    innerDot:{
       
        height:9,
        borderRadius:8,
       
        marginLeft:1,
        backgroundColor:"black",
        width:9,
    },
})