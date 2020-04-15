import React, { useState, useEffect } from 'react';
import { FaGithubAlt, FaPlus, FaSpinner, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import Container from '../../components/Container';
import { Form, SubmitButton, List } from './styles';

import api from '../../services/api';

function Main() {
    const [repo, setRepo] = useState('');
    const [repositories, setRepositories] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        setRepo(e.target.value);
    };

    useEffect(() => {
        // eslint-disable-next-line no-shadow
        const repositories = localStorage.getItem('repositories');

        if (repositories) {
            setRepositories(JSON.parse(repositories));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('repositories', JSON.stringify(repositories));
    }, [repositories]);

    const submitRepo = async (e) => {
        e.preventDefault();

        setLoading(true);

        const response = await api.get(`/${repo}`);

        const data = {
            fullName: response.data.full_name,
            name: response.data.name,
            user: response.data.owner.login,
        };

        setRepositories([...repositories, data]);
        setRepo('');
        setLoading(false);
    };

    // eslint-disable-next-line no-shadow
    const handleRemoveRepo = (repo) => {
        setRepositories(
            // eslint-disable-next-line no-shadow
            repositories.filter((repositories) => repositories !== repo)
        );
    };

    return (
        <Container>
            <h1>
                <FaGithubAlt />
                Repositórios
            </h1>

            <Form onSubmit={submitRepo}>
                <input
                    type="text"
                    placeholder="Adicionar repositório"
                    value={repo}
                    onChange={handleInputChange}
                />

                <SubmitButton loading={loading}>
                    {loading ? (
                        <FaSpinner color="#fff" size={14} />
                    ) : (
                        <FaPlus color="#FFF" size={14} />
                    )}
                </SubmitButton>
            </Form>

            <List>
                {repositories.map((repository) => (
                    <li key={repository.fullName}>
                        <span> {repository.fullName} </span>
                        <Link
                            to={`/repository/${encodeURIComponent(
                                repository.fullName
                            )}`}
                        >
                            {' '}
                            Detalhes{' '}
                        </Link>
                        <button
                            type="button"
                            onClick={() => handleRemoveRepo(repository)}
                        >
                            <FaTrash color="red" size={14} />
                        </button>
                    </li>
                ))}
            </List>
        </Container>
    );
}

export default Main;
