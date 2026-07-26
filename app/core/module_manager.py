import importlib
import pkgutil
from typing import Dict, List, Any
from fastapi import APIRouter
from app.config import get_settings

class ModuleInfo:
    def __init__(self, name: str, router: APIRouter = None, models: Any = None, 
                 menu_items: List[dict] = None, templates_dir: str = None):
        self.name = name
        self.router = router
        self.models = models
        self.menu_items = menu_items or []
        self.templates_dir = templates_dir
        self.enabled = False

class ModuleManager:
    def __init__(self):
        self.modules: Dict[str, ModuleInfo] = {}
        self.settings = get_settings()

    def discover_modules(self):
        """Autodiscovery modułów z katalogu modules/"""
        try:
            import modules
            for importer, modname, ispkg in pkgutil.iter_modules(modules.__path__):
                if modname.startswith("_"):
                    continue
                try:
                    module = importlib.import_module(f"modules.{modname}")
                    info = ModuleInfo(name=modname)

                    # Sprawdź czy moduł ma router
                    if hasattr(module, "router"):
                        info.router = module.router

                    # Sprawdź czy ma modele
                    if hasattr(module, "models"):
                        info.models = module.models

                    # Sprawdź czy ma pozycje menu
                    if hasattr(module, "admin_menu"):
                        info.menu_items = module.admin_menu

                    # Sprawdź czy ma katalog templatek
                    tpl_dir = f"modules/{modname}/templates"
                    if (module.__file__ and 
                        (module.__file__.rsplit("/", 1)[0] + "/templates")):
                        info.templates_dir = tpl_dir

                    self.modules[modname] = info
                except Exception as e:
                    print(f"Błąd ładowania modułu {modname}: {e}")
        except ImportError:
            pass

    def get_enabled_modules(self) -> List[ModuleInfo]:
        enabled = self.settings.enabled_modules_list
        return [m for name, m in self.modules.items() if name in enabled]

    def get_admin_menu(self) -> List[dict]:
        menu = []
        for mod in self.get_enabled_modules():
            for item in mod.menu_items:
                menu.append({**item, "module": mod.name})
        return menu

    def register_routers(self, app):
        for mod in self.get_enabled_modules():
            if mod.router:
                app.include_router(mod.router, prefix=f"/mod/{mod.name}", tags=[mod.name])

module_manager = ModuleManager()
