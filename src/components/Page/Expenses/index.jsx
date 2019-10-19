import React, { useContext, useState, useEffect } from 'react';
import {
  Table,
  Button,
  Jumbotron,
  Form,
  FormGroup,
  Label,
  Input,
} from 'reactstrap';
import { AppStateContext } from 'context';
import {
  fetchExpenses,
  fetchMedicaments,
  deleteExpense,
  openModal,
} from 'redux/actions';
import { addDays, priceFormatter } from 'utils/helpers';
import ExpenseForm from 'components/Form/Expense';
import PageContainer from 'components/Page/PageContainer';

function ExpensesPage() {
  const [{ expenses, medicaments }, dispatch] = useContext(AppStateContext);
  const [from, setFrom] = useState(addDays(-30));
  const [to, setTo] = useState(addDays(0));
  const totalPrice = medicaments.length
    ? expenses.reduce((sum, { quantity, medicament }) => {
        const { price } = medicaments.find(({ id }) => id === medicament);
        return sum + quantity * price;
      }, 0)
    : 0;

  const handleAddClick = expense => {
    openModal(dispatch, {
      header: 'Dodajte novi utrosak',
      body: (
        <ExpenseForm
          onSubmit={() => fetchExpenses(dispatch, { from, to })}
          expense={expense}
        />
      ),
    });
  };

  useEffect(() => {
    fetchExpenses(dispatch, { from, to });
    fetchMedicaments(dispatch);
  }, [dispatch, from, to]);

  return (
    <PageContainer>
      <h2>Troskovi</h2>
      <Button
        onClick={() => handleAddClick()}
        color="primary"
        style={{ marginBottom: '20px' }}
        className="noprint"
      >
        Dodaj novi utrosak
      </Button>
      <Form inline style={{ marginBottom: 20 }}>
        <FormGroup>
          <Label style={{ marginRight: 10 }}>od</Label>
          <Input
            name="from"
            type="date"
            value={from}
            onChange={({ target }) => setFrom(target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Label style={{ margin: '0 10px' }}>do</Label>
          <Input
            name="to"
            type="date"
            value={to}
            onChange={({ target }) => setTo(target.value)}
          />
        </FormGroup>
      </Form>
      <h5 style={{ margin: '20px 0' }}>
        {`Ukupna cena za izabrani period: ${priceFormatter.format(totalPrice)}`}
      </h5>
      {expenses.length ? (
        <Table striped>
          <thead>
            <tr>
              <th>Datum</th>
              <th>Medikament</th>
              <th>Kolicina</th>
              <th>Cena (komad)</th>
              <th>Cena (ukupno)</th>
              <th className="noprint"></th>
            </tr>
          </thead>
          <tbody>
            {expenses
              .sort((expA, expB) => (expA.date > expB.date ? -1 : 1))
              .map(expense => {
                const medicament =
                  medicaments.find(({ id }) => id === expense.medicament) || {};

                return (
                  <tr key={expense.id}>
                    <td>{expense.date}</td>
                    <td>{medicament.name}</td>
                    <td>{expense.quantity}</td>
                    <td>{priceFormatter.format(medicament.price)}</td>
                    <td>
                      {priceFormatter.format(
                        (medicament.price || 0) * expense.quantity,
                      )}
                    </td>
                    <td style={{ width: '200px' }} className="noprint">
                      <Button
                        color="danger"
                        onClick={() => deleteExpense(dispatch, expense.id)}
                      >
                        ukloni
                      </Button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
      ) : (
        <Jumbotron>Nemate nijedan sacuvani utrosak</Jumbotron>
      )}
    </PageContainer>
  );
}

export default ExpensesPage;
