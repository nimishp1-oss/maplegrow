import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import PageHeader from '@/components/shared/PageHeader';
import Metric from '@/components/shared/Metric';
import Panel from '@/components/shared/Panel';
import LinkAction from '@/components/shared/LinkAction';
import BarRow from '@/components/shared/BarRow';
import TransactionList from '@/components/shared/TransactionList';
import AddTransactionDialog from '@/components/shared/AddTransactionDialog';
import EditBudgetDialog from '@/components/shared/EditBudgetDialog';
import StatementImportDialog from '@/components/shared/StatementImportDialog';
import CategoryPieChart from '@/components/finances/CategoryPieChart';
import { base44 } from '@/api/base44Client';
import { useToast } from '@/components/ui/use-toast';
import Disclaimer from '@/components/shared/Disclaimer';
import { budget, money } from '@/lib/finance';

export default function Finances() {
  const { profile, transactions, updateProfile, addTransaction, deleteTransaction, refreshTx } = useOutletContext();
  const [txOpen, setTxOpen] = useState(false);
  const [budgetOpen, setBudgetOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const { toast } = useToast();

  const exportToSheets = async () => {
    if (exporting) return;
    setExporting(true);
    try {
      const res = await base44.functions.invoke('exportMonthlySummaryToSheets', {});
      toast({
        title: 'Exported to Google Sheets',
        description: `${res.data.month} summary — ${res.data.transactions} transactions — is saved in your spreadsheet.`,
      });
    } catch (e) {
      toast({ title: 'Export failed', description: e?.data?.error || 'Could not reach Google Sheets — please try again.', variant: 'destructive' });
    } finally {
      setExporting(false);
    }
  };

  const importStatement = async (rows) => {
    await base44.entities.Transaction.bulkCreate(rows);
    refreshTx();
  };
  const b = budget(profile);
  const max = Math.max(...b.items.map((i) => i.value), 1);

  return (
    <div>
      <PageHeader title="Personal finances" subtitle="Understand what comes in, what goes out, and what remains for your goals." tag="Monthly overview" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <Metric label="Monthly income" value={money(b.income)} note="Work, stipend & aid" />
        <Metric label="Monthly spending" value={money(b.spent)} note={`${b.income ? ((b.spent / b.income) * 100).toFixed(1) : 0}% of income`} tone="down" />
        <Metric label="Available to save" value={money(b.available)} note="Set a monthly target" tone={b.available >= 0 ? 'up' : 'down'} />
        <Metric label="Education debt" value={money(b.debt)} note="Federal + school estimate" tone="down" />
      </div>
      <div className="grid lg:grid-cols-2 gap-4 mt-4">
        <Panel title="Spending categories" subtitle="Your monthly budget by category" action={<LinkAction onClick={() => setBudgetOpen(true)}>Edit budget</LinkAction>}>
          <div className="grid gap-3.5">
            {b.items.map((i) => <BarRow key={i.key} name={i.label} pct={(i.value / max) * 100} value={money(i.value)} color={i.color} />)}
          </div>
          <Disclaimer className="mt-5">Update income, debt, or any category — every page recalculates instantly.</Disclaimer>
        </Panel>
        <Panel title="Recent transactions" subtitle={`${transactions.length} recorded`} action={<div className="flex gap-4"><LinkAction onClick={() => setImportOpen(true)}>Import statement</LinkAction><LinkAction onClick={() => setTxOpen(true)}>+ Add transaction</LinkAction></div>}>
          <div className="max-h-[420px] overflow-y-auto -mr-2 pr-2">
            <TransactionList transactions={transactions} onDelete={(id) => deleteTransaction.mutate(id)} />
          </div>
        </Panel>
      </div>
      <div className="mt-4">
        <Panel title="Where your money goes" subtitle="Your monthly expenses, share by share" action={<LinkAction onClick={exportToSheets}>{exporting ? 'Exporting…' : 'Export to Sheets'}</LinkAction>}>
          <CategoryPieChart items={b.items} total={b.spent} />
        </Panel>
      </div>
      <AddTransactionDialog open={txOpen} onOpenChange={setTxOpen} onSave={addTransaction.mutateAsync} />
      <StatementImportDialog open={importOpen} onOpenChange={setImportOpen} onImport={importStatement} />
      <EditBudgetDialog open={budgetOpen} onOpenChange={setBudgetOpen} profile={profile} onSave={updateProfile.mutateAsync} />
    </div>
  );
}