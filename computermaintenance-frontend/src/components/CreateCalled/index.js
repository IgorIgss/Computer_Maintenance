import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { FiPlus as BtnPlus } from 'react-icons/fi';
import { MdClose as BtnClose } from 'react-icons/md';
import * as Yup from 'yup';
import cogoToast from 'cogo-toast';

import socket from '../../services/websocket';
import api from '../../services/api';

import { handleConvertStringToDate } from '../../util/handleDateField';

import {
  ContainerButton,
  ContainerBackgroundModal,
  ContainerModal,
} from './styles';

export default function CreateCalled() {
  const userData = useSelector((state) => state.userData.data);

  const [toggleModal, setToggleModal] = useState(false);
  const [protocolValue, setProtocolValue] = useState('');
  const [numberOfOSValue, setNumberOfOSValue] = useState('');
  const [situationValue, setSituationValue] = useState('');
  const [deadlineValue, setDeadlineValue] = useState('');
  const [sectorValue, setSectorValue] = useState('');
  const [observationsValue, setObservationsValue] = useState('');

  function handleToggleModal() {
    setToggleModal(!toggleModal);
  }

  function fieldValidation(fields) {
    const validation = Yup.object().shape({
      protocol: Yup.string().required(),
      numberOfOS: Yup.string().required(),
      situation: Yup.string().required(),
      deadline: Yup.date().required(),
      sector: Yup.string().required(),
      observations: Yup.string().required(),
    });

    return validation.isValid(fields);
  }

  async function handleFormSubmit(e) {
    e.preventDefault();

    const formData = {
      protocol: protocolValue,
      numberOfOS: numberOfOSValue,
      situation: situationValue,
      sector: sectorValue,
      deadline: handleConvertStringToDate(deadlineValue),
      observations: observationsValue,
    };

    const formDataIsValid = await fieldValidation(formData);

    if (!formDataIsValid) {
      return cogoToast.error('Erro de validação, tente novamente!', {
        position: 'top-right',
      });
    }

    try {
      const { username } = userData;

      const calledData = await api.post('/register/protocol', {
        ...formData,
        username,
      });

      if (!calledData) {
        return cogoToast.error('Erro ao registrar os dados, tente novamente!', {
          position: 'top-right',
        });
      }

      setToggleModal(!toggleModal);
      setProtocolValue('');
      setNumberOfOSValue('');
      setSituationValue('');
      setDeadlineValue('');
      setSectorValue('');
      setObservationsValue('');

      cogoToast.success('Registro salvo com sucesso.', {
        position: 'top-right',
      });

      return socket.emit('changeData', true);
    } catch (err) {
      const { error } = err.response.data;

      return cogoToast.error(error, {
        position: 'top-right',
      });
    }
  }

  return (
    <>
      <ContainerButton>
        <BtnPlus size={20} color="#fff" onClick={handleToggleModal} />
      </ContainerButton>

      {toggleModal && (
        <ContainerBackgroundModal>
          <ContainerModal>
            <BtnClose size={23} color="#7159c1" onClick={handleToggleModal} />
            <span>Dados da tratativa</span>
            <form onSubmit={handleFormSubmit}>
              <input
                name="protocol"
                type="text"
                placeholder="Protocolo"
                autoComplete="off"
                onChange={(e) => setProtocolValue(e.target.value)}
                value={protocolValue}
              />
              <input
                name="numberOfOS"
                type="text"
                placeholder="Número da OS"
                autoComplete="off"
                onChange={(e) => setNumberOfOSValue(e.target.value)}
                value={numberOfOSValue}
              />
              <input
                name="situation"
                type="text"
                placeholder="Situação"
                autoComplete="off"
                onChange={(e) => setSituationValue(e.target.value)}
                value={situationValue}
              />
              <input
                name="deadline"
                type="text"
                placeholder="Prazo de tratativa"
                autoComplete="off"
                onChange={(e) => setDeadlineValue(e.target.value)}
                value={deadlineValue}
              />
              <select
                required
                name="sector"
                onChange={(e) => setSectorValue(e.target.value)}
                value={sectorValue}
              >
                <option disabled hidden value="">
                  Setor
                </option>
                <option>Manutenção</option>
                <option>Instalação de Software</option>
              </select>
              <textarea
                name="observations"
                placeholder="Observações"
                autoComplete="off"
                onChange={(e) => setObservationsValue(e.target.value)}
                value={observationsValue}
              />

              <button type="submit">Salvar</button>
            </form>
          </ContainerModal>
        </ContainerBackgroundModal>
      )}
    </>
  );
}
