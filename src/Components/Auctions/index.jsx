//Auctions INFO
// This will display the upcoming auctions on the selected network.


//Dependencies
import {useState, useContext, useEffect} from 'react';

//Context
import ChainContext from '../../Context/ChainInfo';

//Helpers
import { calculateTargetDate } from '../../Utils/helpers'

const Auctions = () => {

  //CONTEXT
  const {auctions, durationEP, avgBlockTime, head, timestamp} = useContext(ChainContext);

  //STATE MANAGEMENT
  const [completeAuctions, setCompleteAuctions] = useState([])

  useEffect(() =>{
    setCompleteAuctions([]);
    if (auctions.length && durationEP) {
      const _completeAuctions = auctions.map(auction => {
        const start_date = calculateTargetDate(timestamp, head, auction.starting_period_block, avgBlockTime)
        const end_date = calculateTargetDate(timestamp, head, auction.ending_period_start_block + Number(durationEP), avgBlockTime)
        return {...auction, start_date, auction_end: auction.ending_period_start_block + Number(durationEP), end_date}
      })
      setCompleteAuctions(_completeAuctions)
    }
  }, [auctions, avgBlockTime])

  //TODO: Maybe only render this if all the info is available?

  return (
    <>
    {completeAuctions.length 
      ? <table style={{margin:"auto"}}>
      <thead>
        <tr>
          <th>LP's Auctioned</th>
          <th>Auction Starts</th>
          <th>Date</th>
          <th>Ending Period Starts</th>
          <th>Auction Ends</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {completeAuctions.map(auction => {
          return (
            <tr key={auction.ending_period_start_block}>
              <td>{`${auction.first_lease_period} - ${Number(auction.first_lease_period) + 7}`}</td>
              <td>{auction.starting_period_block ? auction.starting_period_block : "LIVE"}</td>
              <td>{(auction.start_date &&  avgBlockTime)? auction.start_date.toLocaleDateString() : "Calculating"}</td>
              <td>{auction.ending_period_start_block}</td>
              <td>{auction.auction_end}</td>
              <td>{(auction.end_date &&  avgBlockTime) ? auction.end_date.toLocaleDateString() : "Calculating"}</td>
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