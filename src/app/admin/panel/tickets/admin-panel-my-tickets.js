import React from 'react';
import {connect}  from 'react-redux';

import i18n from 'lib-app/i18n';

import AdminDataAction from 'actions/admin-data-actions';
import TicketList from 'app-components/ticket-list';
import ModalContainer from 'app-components/modal-container';
import CreateTicketForm from 'app/main/dashboard/dashboard-create-ticket/create-ticket-form';

import Button from 'core-components/button';
import Icon from 'core-components/icon';
import Header from 'core-components/header';
import Message from 'core-components/message';

class AdminPanelMyTickets extends React.Component {

    static defaultProps = {
        userId: 0,
        departments: [],
        tickets: [],
        page: 1,
        pages: 0,
    };

    state = {
        closedTicketsShown: false,
        departmentId: null,
        paginationId: 10,
        title:'',
    };

    componentDidMount() {
        this.retrieveMyTickets();
    }

    render() {
        console.log("admin-panel-my-tickets - ajuaaaa... ", this.props.userLevel*1);//quitar despues
        console.log("admin-panel-my-tickets.js lo que pasa como departments ", this.props.departments);//quitar despues
        return (
            <div className="admin-panel-my-tickets">
                <Header title={i18n('MY_TICKETS')} description={i18n('MY_TICKETS_DESCRIPTION')} />
                {
                    (this.props.error) ? 
                    <Message type="error">{i18n('ERROR_RETRIEVING_TICKETS')}</Message> 
                    : <TicketList {...this.getProps()}/>
                }
                <div style={{textAlign: 'right', marginTop: 10}}>
                    <Button onClick={this.onCreateTicket.bind(this)} type="secondary" size="medium">
                        <Icon size="sm" name="plus"/> {i18n('CREATE_TICKET')}
                    </Button>
                </div>
            </div>
        );
    }

    getProps() {
        return {
            userId: this.props.userId,
            departments: this.props.departments,
            paginations: [{name: 10},{name: 20},{name: 30},{name: 50},{name: 100}],
            tickets: this.props.tickets,
            type: 'secondary',
            loading: this.props.loading,
            ticketPath: '/admin/panel/tickets/view-ticket/',
            closedTicketsShown: this.state.closedTicketsShown,
            onClosedTicketsShownChange: this.onClosedTicketsShownChange.bind(this),
            onChange: this.onChange.bind(this),
            onSearch: this.onSearch.bind(this),
            pages: this.props.pages,
            page: this.props.page,
            onPageChange: event => this.retrieveMyTickets(event.target.value),
            onDepartmentChange: departmentId => {
                console.log("onDepartmentChange en admin panel: ",departmentId);
                this.setState({departmentId});
                this.retrieveMyTickets(1, this.state.closedTicketsShown, departmentId, this.state.title);
            },
            onPaginationChange: paginationId => {
                console.log("===== onpagination en admin-panel-my-tickets: ",paginationId);
                this.setState({paginationId});
                this.retrieveMyTickets(1, this.state.closedTicketsShown, this.state.departmentId, this.state.title, paginationId);
            },
        };
    }

    onClosedTicketsShownChange() {
        this.setState(function(state) {
            return {
                closedTicketsShown: !state.closedTicketsShown
            };
        }, () => this.retrieveMyTickets());
    }

    onChange(valing) {
        this.setState({
            title: valing
        });
    }

    onSearch(query){
        this.setState(function(state) {
            return {
                title: query
            };
        }, () => this.retrieveMyTickets());
    }

    onCreateTicket() {
        ModalContainer.openModal(
            <div>
                <CreateTicketForm isStaff={true} onSuccess={this.onCreateTicketSuccess.bind(this)} />
                <div style={{textAlign: 'center'}}>
                    <Button onClick={ModalContainer.closeModal} type="link">{i18n('CLOSE')}</Button>
                </div>
            </div>
        );
    }

    onCreateTicketSuccess() {
        ModalContainer.closeModal();
        this.retrieveMyTickets();
    }

    retrieveMyTickets(page = this.props.page, closed = this.state.closedTicketsShown, departmentId = this.state.departmentId, title = this.state.title, rpp = this.state.paginationId ) {
        this.props.dispatch(AdminDataAction.retrieveMyTickets(page, closed * 1, departmentId, title, rpp));
    }
}

export default connect((store) => {
    return {
        userId: store.session.userId*1,
        userLevel: store.session.userLevel*1,
        departments: store.session.userDepartments,
        tickets: store.adminData.myTickets,
        page: store.adminData.myTicketsPage,
        pages: store.adminData.myTicketsPages,
        loading: !store.adminData.myTicketsLoaded,
        error: store.adminData.myTicketsError
    };
})(AdminPanelMyTickets);
