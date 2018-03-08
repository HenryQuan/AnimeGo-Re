import React, { PureComponent } from 'react';
import { ActivityIndicator, Text, FlatList, Platform, View, Dimensions } from 'react-native';
import { isPortrait, deviceHeight, deviceWidth } from '../../helper/DeviceDimensions';
import AnimeLoader from '../../helper/core/AnimeLoader';
import AnimeCell from '../cell/AnimeCell';
import { LoadingIndicator, FabButton } from '../../component';

class AnimeList extends PureComponent {
  constructor(props) {
    super(props);
    this.currWidth = deviceWidth;
    this.state = {
      data: [],
      page: 1,
      hasMorePage: true,
      isRefreshing: false,
      url: props.AnimeUrl,
      width: deviceWidth,
      column: 0
    };
  }

  componentWillMount() {
    // Loading anime
    this.loadAnime();
    this.updateColumn();
    console.log(isPortrait(), deviceHeight, deviceWidth);
  }

  animeKey = (item, index) => {
    return item.link;
  }

  render() {
    const { data, isRefreshing, column, width } = this.state;
    if (data.length == 0) return <LoadingIndicator />
    else {
      return (
        <View style={{flex: 1}} onLayout={this.updateColumn}>
          <FlatList data={data} keyExtractor={this.animeKey} renderItem={({item}) => <AnimeCell data={item} column={column} width={width}/>} 
            key={(isPortrait() ? 'p' + width : 'l' + width)} numColumns={column} refreshing={isRefreshing}
            ListFooterComponent={this.renderFooterComponent} automaticallyAdjustContentInsets={false}
            onRefresh={this.refreshAnime} onEndReached={this.loadAnime} onEndReachedThreshold={0.5} showsVerticalScrollIndicator={false} />
          { this.renderFabButton() }
        </View>
      )
    }
  }

  // Sometimes, FAB is not needed
  renderFabButton = () => {
    if (this.props.showFab != false && Platform.OS == 'android') return <FabButton />
    else return null;
  }

  updateColumn = () => {
    if (this.state.column == 0) this.setState({column: isPortrait() ? 2 : 4})
    const { width } = Dimensions.get('window');
    if (Math.abs(this.currWidth - width) < 50) return;
    this.currWidth = width;    
    this.setState({column: isPortrait() ? 2 : 4, width: width})
  }

  refreshAnime = () => {
    this.setState({
      data: [],
      page: 1,
      hasMorePage: true,
      isRefreshing: false,
    }, () => this.loadAnime())
  }

  renderFooterComponent = () => {
    if (!this.state.hasMorePage) return null;
    else return <LoadingIndicator />
  }

  loadAnime = () => {
    console.log('Loading anime');
    const { hasMorePage, isRefreshing, url, page, data } = this.state;
    if (!hasMorePage && !isRefreshing) return;
    let loader = new AnimeLoader(url, page);
    loader.loadAnime().then((animeData) => {
      if (animeData.length == 0) {
        // No more pages
        this.setState({
          hasMorePage: false,
          isRefreshing: false,
        })
      } else if (animeData.length < 20 && !global.hideDub) {
        // Append data
        this.setState({
          data: data.concat(animeData),
          isRefreshing: false,
          hasMorePage: false,
        })
      } else {
        // Append data
        this.setState({
          data: data.concat(animeData),
          page: page + 1,
          isRefreshing: false,
        })
      }
    })
    .catch((error) => {
      console.error(error);
      this.setState({isRefreshing: false, hasMorePage: false})
    })
  }
}

export {AnimeList};