import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import api from '../../services/api';

import Container from '../../components/Container';
import { Loading, Owner, IssueList } from './styles';

function Repository({ match }) {
    const [repository, setRepository] = useState({});
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);

    const repoName = decodeURIComponent(match.params.repository);

    const buscarApi = async () => {
        const [repository, issues] = await Promise.all([
            api.get(`/${repoName}`),
            api.get(`/${repoName}/issues`, {
                params: {
                    state: 'open',
                    per_page: 5,
                },
            }),

            // eslint-disable-next-line no-use-before-define
        ]);

        setRepository(repository.data);
        setIssues(issues.data);
        setLoading(false);
    };

    useEffect(() => {
        // eslint-disable-next-line react/prop-types
        buscarApi();
    }, []);

    if (loading) {
        return <Loading> Carregando... </Loading>;
    }

    return (
        <Container>
            <Owner>
                <Link to="/"> Voltar aos repositórios </Link>
                <img
                    src={repository.owner.avatar_url}
                    alt={repository.owner.login}
                />
                <h1> {repository.name} </h1>
                <p> {repository.description} </p>
            </Owner>
            <IssueList>
                {issues.map((issue) => (
                    <li key={String(issue.id)}>
                        <img
                            src={issue.user.avatar_url}
                            alt={issue.user.login}
                        />
                        <div>
                            <strong>
                                <a href={issue.html_url}> {issue.title} </a>
                                {issue.labels.map((label) => (
                                    <span key={String(label.id)}>
                                        {' '}
                                        {label.name}{' '}
                                    </span>
                                ))}
                            </strong>
                            <p> {issue.user.login} </p>
                        </div>
                    </li>
                ))}
            </IssueList>
        </Container>
    );
}

Repository.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            repository: PropTypes.string,
        }),
    }).isRequired,
};

export default Repository;
