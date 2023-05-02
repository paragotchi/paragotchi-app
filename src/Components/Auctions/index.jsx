//Auctions INFO
// This will display the upcoming auctions on the selected network.


//Dependencies
import {useState, useContext, useEffect} from 'react';

//Context
import ChainContext from '../../Context/ChainInfo';
import ApiContext from '../../Context/ApiConnect';

const Auctions = () => {

  //CONTEXT
  const {auctions, durationEP} = useContext(ChainContext);
  const {api} = useContext(ApiContext);

  //STATE MANAGEMENT
  const [completeAuctions, setCompleteAuctions] = useState([])

  useEffect(() =>{
    setCompleteAuctions([]);
    if (auctions.length && durationEP) {
      const _completeAuctions = auctions.map(auction => {
        return {...auction, auction_end: auction.ending_period_start_block + Number(durationEP)}
      })
      setCompleteAuctions(_completeAuctions)
    }
  }, [auctions])

  return (
    <>
    {completeAuctions.length 
      ? <table style={{margin:"auto"}}>
      <thead>
        <th>LP's Auctioned</th>
        <th>Auction Starts</th>
        <th>Ending Period Starts</th>
        <th>Auction Ends</th>
      </thead>
      <tbody>
        {completeAuctions.map(auction => {
          return (
            <tr key={auction.ending_period_start_block}>
              <td>{`${auction.first_lease_period} - ${Number(auction.first_lease_period) + 7}`}</td>
              <td>{auction.starting_period_block ? auction.starting_period_block : "LIVE"}</td>
              <td>{auction.ending_period_start_block}</td>
              <td>{auction.auction_end}</td>
            </tr>
          )
        })}
      </tbody>
      </table>
      :<p>No Auctions Planned</p>
    }
    </>
  )

}


export default Auctions;