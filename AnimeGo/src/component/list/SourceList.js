import React, { Component } from 'react';
import { View, Text, Button, FlatList, Dimensions } from 'react-native';
import AnimeSourceLoader from '../../helper/core/AnimeSourceLoader';
import SourceCell from '../cell/SourceCell';
import { LoadingIndicator } from '../../component';
import { Actions } from 'react-native-router-flux';
import { SecondaryColour, RedColour, GreenColour } from '../../value';
import { styles } from './SourceListStyles';

class SourceList extends Component {

  keyExtractor = (data) => data.source;

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      name: '', link: '',
    }
  }

  componentWillMount() {
    let source = new AnimeSourceLoader(this.props.link);
    source.loadSource().then((animeSource) => {
      // console.log(animeSource);
      if (animeSource.length == 0) return;
      this.setState({
        data: animeSource,
        name: animeSource[1].animeName,
        link: animeSource[1].infoLink,
      })  
    })
    .catch((error) => {
      console.error(error);
    });
  }

  render() {
    const { data } = this.state;
    if (data.length == 0) return <LoadingIndicator />
    else {
      return (
        <View>
          <FlatList keyExtractor={this.keyExtractor} ListHeaderComponent={this.renderHeader}
            data={data} renderItem={({item}) => <SourceCell data={item}/>} />
          <Text style={{padding: 8, fontSize: 12}}>{'Ads are from website itself.\nThis app does not have any controls over it.'}</Text>
        </View>
      )
    }
  }

  renderHeader = () => {
    const { headerViewStyle, textStyle } = styles;
    return (
      <View style={headerViewStyle}>
        <Text style={textStyle}>Anime Detail</Text>
        <Button title={this.state.name} onPress={this.infoBtnPressed} color={GreenColour}/>
      </View>
    )
  }

  infoBtnPressed = () => {
    // In case user wants infinite loop
    const { name, link } = this.state;
    if (this.props.fromInfo) Actions.pop();
    else Actions.AnimeDetail({title: name, link: link});
  }
}

export { SourceList };