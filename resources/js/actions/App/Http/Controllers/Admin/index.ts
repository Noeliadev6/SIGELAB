import DashboardController from './DashboardController'
import CatalogoController from './CatalogoController'
import InventarioSubLaboratorioController from './InventarioSubLaboratorioController'
import EstudianteController from './EstudianteController'
import MateriaController from './MateriaController'
import PrestacionController from './PrestacionController'
import EstudianteImportController from './EstudianteImportController'
import BackupController from './BackupController'
import UsuarioController from './UsuarioController'
import RolController from './RolController'
const Admin = {
    DashboardController: Object.assign(DashboardController, DashboardController),
CatalogoController: Object.assign(CatalogoController, CatalogoController),
InventarioSubLaboratorioController: Object.assign(InventarioSubLaboratorioController, InventarioSubLaboratorioController),
EstudianteController: Object.assign(EstudianteController, EstudianteController),
MateriaController: Object.assign(MateriaController, MateriaController),
PrestacionController: Object.assign(PrestacionController, PrestacionController),
EstudianteImportController: Object.assign(EstudianteImportController, EstudianteImportController),
BackupController: Object.assign(BackupController, BackupController),
UsuarioController: Object.assign(UsuarioController, UsuarioController),
RolController: Object.assign(RolController, RolController),
}

export default Admin