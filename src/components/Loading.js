/*
export default ({Loading}) => <div>
    {isLoading?<div className="loading">Loading&#8230;</div>:null}
</div>
*/

class Loading extends Component {

  constructor(props) {
    super(props);
  }

  render() {

    const { isLoading } = this.props

      if (isLoading) {
        return (
            <div className="loading">Loading&#8230;</div>
        )
      }
  }


}


export default Loading 



