import 'react-native' 
import React from 'react'
import Index from '../app/index'
import renderer from 'react-test-renderer'
import { Animated, Text, Button, View } from 'react-native';


describe("Index", () =>{
    it("home page is being rendered", () => {
        const testRenderer = renderer.create(<Index t="test1"/>);
        const testInstance = testRenderer.root;
    
   
        expect(testInstance.props.t).toBe("test1");
   
    });

    it("home text is correct", () => {
        const testRenderer = renderer.create(<Index t="test1"/>);
        const testInstance = testRenderer.root;
    
   
        expect(testInstance.findAllByType(Text)[0].props.children).toBe("HOme");
   
    });
    
    it("home text is correct", () => {
        const tree = renderer.create(<Index t="Test1" />).toJSON();
      expect(tree).toMatchSnapshot();
       
   
    });
}); 