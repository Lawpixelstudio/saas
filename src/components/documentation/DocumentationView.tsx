import React, { useState } from 'react';
import { 
  FileText, 
  Code2, 
  CheckSquare, 
  Square, 
  Key, 
  Plus, 
  Save, 
  Trash2, 
  Copy, 
  Eye, 
  Edit3, 
  Layers, 
  FileCode, 
  CheckCircle2, 
  Sparkles,
  BookOpen
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Breadcrumbs } from '../layout/Breadcrumbs';
import { CopyButton } from '../common/CopyButton';
import { ProjectNote } from '../../types';

export const DocumentationView: React.FC = () => {
  const { 
    projectNotes, 
    projects, 
    selectedProjectId, 
    setSelectedProjectId,
    addProjectNote, 
    updateProjectNote, 
    deleteProjectNote,
    toggleChecklistItem,
    showToast
  } = useApp();

  const [activeProjectId, setActiveProjectId] = useState<string>(
    selectedProjectId || projects[0]?.id || ''
  );

  const currentProjectNotes = projectNotes.filter(n => n.projectId === activeProjectId);
  const [selectedNoteId, setSelectedNoteId] = useState<string>(
    currentProjectNotes[0]?.id || projectNotes[0]?.id || ''
  );

  const [isEditing, setIsEditing] = useState(false);
  const [editorContent, setEditorContent] = useState('');
  const [editorTitle, setEditorTitle] = useState('');
  const [editorCategory, setEditorCategory] = useState<ProjectNote['category']>('minuta');

  const selectedNote = projectNotes.find(n => n.id === selectedNoteId) || currentProjectNotes[0];
  const selectedProject = projects.find(p => p.id === activeProjectId);

  const handleSelectNote = (note: ProjectNote) => {
    setSelectedNoteId(note.id);
    setIsEditing(false);
  };

  const handleStartEdit = () => {
    if (!selectedNote) return;
    setEditorTitle(selectedNote.title);
    setEditorContent(selectedNote.markdownContent);
    setEditorCategory(selectedNote.category);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (!selectedNote) return;
    updateProjectNote(selectedNote.id, {
      title: editorTitle.trim() || selectedNote.title,
      markdownContent: editorContent,
      category: editorCategory,
    });
    setIsEditing(false);
  };

  const handleCreateNewNote = () => {
    if (!activeProjectId) return;
    const newNote = addProjectNote({
      projectId: activeProjectId,
      title: `Nueva Nota - ${new Date().toLocaleDateString()}`,
      category: 'minuta',
      markdownContent: `### Nueva Documentación
Escribe aquí las minutas, variables o credenciales...`,
    });
    setSelectedNoteId(newNote.id);
    setIsEditing(true);
    setEditorTitle(newNote.title);
    setEditorContent(newNote.markdownContent);
    setEditorCategory('minuta');
  };

  // Render Markdown-like formatted elements simply and safely
  const renderMarkdown = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      // Heading 3
      if (line.startsWith('### ')) {
        return <h3 key={idx} className="text-base font-bold text-slate-900 mt-4 mb-2">{line.replace('### ', '')}</h3>;
      }
      // Heading 4
      if (line.startsWith('#### ')) {
        return <h4 key={idx} className="text-sm font-bold text-slate-800 mt-3 mb-1">{line.replace('#### ', '')}</h4>;
      }
      // Blockquote
      if (line.startsWith('> ')) {
        return (
          <blockquote key={idx} className="p-3 my-2 border-l-4 border-[#38A5F8] bg-blue-50/50 text-slate-700 text-xs rounded-r-lg">
            {line.replace('> ', '')}
          </blockquote>
        );
      }
      // Code block start/end
      if (line.startsWith('```')) {
        return null; // Handled in raw formatting
      }
      // List items
      if (line.startsWith('- [x] ')) {
        return (
          <div key={idx} className="flex items-center gap-2 text-slate-500 line-through text-xs my-1">
            <CheckSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{line.replace('- [x] ', '')}</span>
          </div>
        );
      }
      if (line.startsWith('- [ ] ')) {
        return (
          <div key={idx} className="flex items-center gap-2 text-slate-800 text-xs my-1 font-medium">
            <Square className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{line.replace('- [ ] ', '')}</span>
          </div>
        );
      }
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return (
          <li key={idx} className="ml-4 list-disc text-xs text-slate-700 my-1">
            {line.replace(/^[-*]\s+/, '')}
          </li>
        );
      }
      // Empty line
      if (!line.trim()) {
        return <div key={idx} className="h-2"></div>;
      }
      // Standard paragraph
      return <p key={idx} className="text-xs text-slate-700 leading-relaxed my-1">{line}</p>;
    });
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#F8FAFC]">
      <Breadcrumbs
        title="Notas & Documentación Interna"
        subtitle="Minutas, credenciales secundarias, variables .env y pre-launch checklist por proyecto"
        badge={{
          text: selectedProject ? selectedProject.name : 'Documentación General',
          variant: 'blue'
        }}
        primaryAction={{
          label: 'Nueva Nota',
          onClick: handleCreateNewNote,
          icon: <Plus className="w-3.5 h-3.5" />
        }}
      />

      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 max-w-7xl w-full mx-auto">
        {/* Project Selector Bar */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Proyecto Seleccionado:
            </span>
            <select
              value={activeProjectId}
              onChange={e => {
                setActiveProjectId(e.target.value);
                const firstNote = projectNotes.find(n => n.projectId === e.target.value);
                if (firstNote) setSelectedNoteId(firstNote.id);
              }}
              className="px-3 py-1.5 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:outline-hidden"
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.deliveryType})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>{currentProjectNotes.length} documento(s) en este proyecto</span>
          </div>
        </div>

        {/* 2-COLUMN LAYOUT: DOCUMENT LIST + MARKDOWN VIEWER/EDITOR */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Note Directory */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Documentos del Proyecto
              </h3>
              <button
                onClick={handleCreateNewNote}
                className="text-xs font-bold text-[#1d8fe6] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Crear</span>
              </button>
            </div>

            <div className="divide-y divide-slate-100 p-2 overflow-y-auto max-h-[600px]">
              {currentProjectNotes.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">
                  <FileText className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p>Sin notas en este proyecto.</p>
                  <button
                    onClick={handleCreateNewNote}
                    className="mt-2 text-xs font-bold text-[#1d8fe6] hover:underline"
                  >
                    + Crear la primera nota
                  </button>
                </div>
              ) : (
                currentProjectNotes.map(note => {
                  const isSelected = selectedNote?.id === note.id;

                  let catBadge = 'bg-slate-100 text-slate-700';
                  if (note.category === 'env_vars') catBadge = 'bg-blue-50 text-[#1d8fe6]';
                  if (note.category === 'pre_launch') catBadge = 'bg-emerald-50 text-emerald-700';
                  if (note.category === 'credenciales') catBadge = 'bg-amber-50 text-amber-800';

                  return (
                    <div
                      key={note.id}
                      onClick={() => handleSelectNote(note)}
                      className={`p-3 rounded-xl cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-blue-50/70 border border-[#38A5F8]/30 shadow-2xs' 
                          : 'hover:bg-slate-50 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${catBadge}`}>
                          {note.category.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] text-slate-400">{note.updatedAt}</span>
                      </div>
                      <h4 className={`text-xs font-bold ${isSelected ? 'text-[#1d8fe6]' : 'text-slate-900'} truncate`}>
                        {note.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        {note.markdownContent.replace(/[#*`>-]/g, '').slice(0, 60)}...
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Markdown Editor / Viewer (Col Span 2) */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
            {selectedNote ? (
              <>
                {/* Viewer Header */}
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base font-black text-slate-900">
                      {isEditing ? 'Editando Documento' : selectedNote.title}
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      Categoría: <span className="font-semibold uppercase">{selectedNote.category}</span> • Última actualización: {selectedNote.updatedAt}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <CopyButton textToCopy={selectedNote.markdownContent} label="Copiar Markdown" />

                    {isEditing ? (
                      <button
                        onClick={handleSaveEdit}
                        className="px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Guardar</span>
                      </button>
                    ) : (
                      <button
                        onClick={handleStartEdit}
                        className="px-3.5 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                        <span>Editar</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        if (confirm(`¿Eliminar la nota "${selectedNote.title}"?`)) {
                          deleteProjectNote(selectedNote.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                      title="Eliminar documento"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-6 flex-1 overflow-y-auto max-h-[650px]">
                  {isEditing ? (
                    <div className="space-y-4 text-xs">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Título del Documento</label>
                        <input
                          type="text"
                          value={editorTitle}
                          onChange={e => setEditorTitle(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-900 focus:bg-white focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Categoría</label>
                        <select
                          value={editorCategory}
                          onChange={e => setEditorCategory(e.target.value as any)}
                          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold focus:bg-white focus:outline-hidden"
                        >
                          <option value="minuta">Minuta de Reunión</option>
                          <option value="credenciales">Credenciales & Accesos Secundarios</option>
                          <option value="env_vars">Variables de Entorno (.env)</option>
                          <option value="pre_launch">Pre-Launch Checklist</option>
                          <option value="arquitectura">Arquitectura & Diagramas</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Contenido Markdown</label>
                        <textarea
                          rows={14}
                          value={editorContent}
                          onChange={e => setEditorContent(e.target.value)}
                          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-800 focus:bg-white focus:outline-hidden"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Pre-launch interactive checklist if available */}
                      {selectedNote.checklist && selectedNote.checklist.length > 0 && (
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 mb-4">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Pre-Launch Verification Checklist</span>
                          </h4>
                          <div className="space-y-2">
                            {selectedNote.checklist.map(item => (
                              <div
                                key={item.id}
                                onClick={() => toggleChecklistItem(selectedNote.id, item.id)}
                                className={`p-2.5 rounded-xl border cursor-pointer select-none transition-all flex items-center justify-between gap-2 ${
                                  item.checked 
                                    ? 'bg-emerald-50/50 border-emerald-200 text-slate-500' 
                                    : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-800'
                                }`}
                              >
                                <div className="flex items-center gap-2.5">
                                  {item.checked ? (
                                    <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                                  ) : (
                                    <Square className="w-4 h-4 text-slate-400 shrink-0" />
                                  )}
                                  <span className={`text-xs ${item.checked ? 'line-through' : 'font-medium'}`}>
                                    {item.text}
                                  </span>
                                </div>
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                                  {item.category}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Markdown preview rendering */}
                      <div className="prose max-w-none text-slate-800">
                        {renderMarkdown(selectedNote.markdownContent)}
                      </div>

                      {/* Raw code preview box for env_vars */}
                      {selectedNote.category === 'env_vars' && (
                        <div className="mt-4 p-4 bg-slate-900 rounded-xl text-slate-200 font-mono text-xs overflow-x-auto relative">
                          <div className="absolute right-3 top-3">
                            <CopyButton textToCopy={selectedNote.markdownContent} label="Copiar .env" />
                          </div>
                          <pre className="mt-6 whitespace-pre-wrap">{selectedNote.markdownContent}</pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="p-12 text-center text-slate-400 text-xs">
                Selecciona o crea una nota para ver su contenido.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
