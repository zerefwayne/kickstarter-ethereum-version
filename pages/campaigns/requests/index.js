import React, {Component} from 'react';
import { Button, Table } from 'semantic-ui-react';
import { Link } from '../../../routes';
import Layout from '../../../components/Layout';
import Campaign from '../../../ethereum/campaign';
import RequestRow from '../../../components/RequestRow';
import { request } from 'http';
class RequestIndex extends Component {
    static async getInitialProps(props) {
        
        const {address} = props.query;
        const campaign = await Campaign(address);
        const requestCount = await campaign.methods.getRequestCount().call();
        const approversCount = await campaign.methods.approversCount().call();

        console.log('requestCount', requestCount);

        const requests = await Promise.all(
            Array(parseInt(requestCount))
                .fill()
                .map((element, index)=>{
                return campaign.methods.requests(index).call();
            })
        );

        return { address, requests, requestCount, approversCount };
    }

    renderRows() {
        return this.props.requests.map((request, index) => {
            return <RequestRow 
                key={index}
                id={index}
                request = {request}
                address={this.props.address}
                approversCount = {this.props.approversCount}
            />;
        });
    }
    
    render() {

        const { Header, Row, HeaderCell, Body} = Table;

        return (
            <Layout>
                <h2>Requests</h2>
                <Link route={`/campaigns/${this.props.address}/requests/new`}>
                    <a>
                        <Button primary floated="right" style={{marginBottom: '10px'}}>Add Request</Button>
                    </a>
                </Link>


                <Table>
                    <Header>
                        <Row>
                            <HeaderCell>ID</HeaderCell>
                            <HeaderCell>Description</HeaderCell>
                            <HeaderCell>Amount (ether)</HeaderCell>
                            <HeaderCell>Recipient</HeaderCell>
                            <HeaderCell>Approval Count</HeaderCell>
                            <HeaderCell>Approve</HeaderCell>
                            <HeaderCell>Finalize</HeaderCell>
                            <HeaderCell>Status</HeaderCell>
                        </Row>
                    </Header>

                    <Body>
                        {this.renderRows()}

                    </Body>
                    
                </Table>

                <div>Found {this.props.requestCount} requests. </div>

            </Layout>
        );
    }
};

export default RequestIndex;