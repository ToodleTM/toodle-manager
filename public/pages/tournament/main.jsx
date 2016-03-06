var TournamentItem = React.createClass({
    getInitialState: function () {
        return {data: []}
    },
    render: function () {
        var id= '/edit-tournament/'+this.props.id
        return (
            <tr>
                <td><a href={id}> {this.props.name}</a></td>
                <td>{this.props.engine}</td>
                <td>{this.props.public?'Yes':'No'}</td>
                <td>{moment(this.props.creationDate).format('DD-MM-YYYY')}</td>
                <td>{this.props.startDate? moment(this.props.startDate).format('dd-MM-YYYY') : 'No Date'}</td>
                <td>{this.props.running ? 'Yes' : 'No'}</td>
                <td>{this.props.cupMember ? 'Yes': 'No'}</td>
                <td><a href="#">Delete</a></td>
            </tr>
        );
    }
});

var TournamentsList = React.createClass({
    render: function () {
        var tournaments = this.props.data.map(function (tournament) {
            return (
                <TournamentItem id={tournament._id}
                                public={tournament.public}
                                name={tournament.tournamentName} engine={tournament.engine}
                                startDate={tournament.startDate}
                                creationDate={tournament.creationTimestamp}
                                running={tournament.running}
                                cupMember={tournament.parentTournamentPublicId || tournament.followingTournamentPublicId}/>
            );
        });
        return (
            <table className="tournamentsList table table-striped">
                <tbody>
                <tr>
                    <th>Tournament Name</th>
                    <th>Engine</th>
                    <th>Public</th>
                    <th>Creation Date</th>
                    <th>Start Date</th>
                    <th>Ongoing</th>
                    <th>Part of a cup</th>
                    <th>Delete ?</th>
                </tr>
                {tournaments}
                </tbody>
            </table>
        );
    }
});

var TournamentsPage = React.createClass({
    getInitialState: function () {
        return {data: [], page: 1}
    },
    getTournaments: function (pageNumber) {
        $.ajax({
            url: this.props.url + '?pageNumber=' + pageNumber,
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({data: data, page: pageNumber});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    getPreviousTournaments: function () {
        if(this.state.page >1){
            this.getTournaments(this.state.page - 1);
        }
    },
    getNextTournaments: function () {
        if(this.state.data.length === 20){
            this.getTournaments(this.state.page + 1);
        }
    },
    componentDidMount: function () {
        this.getTournaments(this.state.page);
    },
    render: function () {
        return (<div className="tournamentsPage">
                <h1> Tournaments </h1>
                <TournamentsList data={this.state.data}/>
                <ul className="pager">
                    <li className="previous"><a href="#" onClick={this.getPreviousTournaments}><span
                        aria-hidden="true">&larr;</span> Older</a></li>
                    <li className="next"><a href="#" onClick={this.getNextTournaments}>Newer <span
                        aria-hidden="true">&rarr;</span></a></li>
                </ul>
            </div>
        );
    }
});

ReactDOM.render(
    <TournamentsPage url="/login/list-tournaments"/>
    , document.getElementById('tournamentsListingComponent'));